/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";
import { apiSlice } from "./requestSlice";
import {
  setLoading,
  setError,
  setDetailedWord,
} from "./wordSlice";
import {
  getResultsFromResponse,
  transformSearchResponse,
} from "@/utils/transformSearchResponse";

const FALLBACK_WORD = {
  word: "Dish",
  meaning:
    "A dish refers to a prepared or cooked item of food that is served as part of a meal.",
  photo: { url: "/images/dish.svg", type: "photo" as const },
};

/** Put the result that exactly matches the search term first; others follow as related. */
function reorderResultsExactFirst(results: any[], termLower: string): any[] {
  if (results.length <= 1) return results;
  const exactIndex = results.findIndex(
    (r) => (r?.word?.ota ?? "").toLowerCase() === termLower,
  );
  if (exactIndex <= 0) return results;
  const exact = results[exactIndex];
  const rest = results.filter((_, i) => i !== exactIndex);
  return [exact, ...rest];
}

export const wordEndpoints = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    wordOfDay: builder.query<
      {
        word: string;
        meaning: string;
        phonetic?: string;
        ipa?: string;
        audioUrl?: string;
        photo?: { url: string; type: string };
      },
      void
    >({
      query: () => ({ url: "/word/daily-word" }),
      transformResponse: (response: any) => {
        const wordData = response?.data?.wordOfTheDay;
        const firstOho = wordData?.oho?.[0];
        const meaning = firstOho?.oto || "";
        const firstMedia = firstOho?.oma?.[0];
        const hasImage = firstMedia?.url;
        const audioUrl = firstOho?.omra?.[0] || undefined;
        return {
          word: wordData?.ota || FALLBACK_WORD.word,
          meaning,
          phonetic: firstOho?.uphoesio || undefined,
          ipa: firstOho?.upho || undefined,
          audioUrl,
          ...(hasImage && {
            photo: {
              url: firstMedia.url,
              type: firstMedia?.type || "photo",
            },
          }),
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
          await queryFulfilled;
        } catch {
          dispatch(setError("Failed to fetch word of day"));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    getWordDetails: builder.query<
      ReturnType<typeof transformSearchResponse>,
      { term: string; language?: string; reverse?: boolean }
    >({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const lang = arg.language || "urhobo";
        const termLower = arg.term.trim().toLowerCase();
        const paramsExact: Record<string, string> = {
          q: arg.term,
          mode: "exact",
        };
        if (arg.reverse) paramsExact.reverse = "true";
        const exact = await baseQuery({
          url: "/word/search",
          params: paramsExact,
        });
        if (exact.error) {
          if (exact.error.status === 401) {
            return {
              error: { status: 401, data: { message: "Unauthorized" } } as any,
            };
          }
          return {
            error: {
              status: (exact.error as any).status,
              data: (exact.error as any).data,
            } as any,
          };
        }
        let exactResults = getResultsFromResponse(exact.data);
        if (exactResults.length > 0) {
          exactResults = reorderResultsExactFirst(exactResults, termLower);
          const raw = (exact.data as any) || {};
          const payload = {
            ...raw,
            data: { ...(raw.data || {}), results: exactResults },
          };
          const transformed = transformSearchResponse(payload, lang);
          (transformed.metadata as any).isPartialSearch = false;
          return { data: transformed };
        }
        const paramsPartial: Record<string, string> = {
          q: arg.term,
          mode: "partial",
        };
        if (arg.reverse) paramsPartial.reverse = "true";
        const partial = await baseQuery({
          url: "/word/search",
          params: paramsPartial,
        });
        if (partial.error) {
          return {
            error: {
              status: (partial.error as any).status,
              data: (partial.error as any).data,
            } as any,
          };
        }
        let partialResults = getResultsFromResponse(partial.data);
        if (partialResults.length > 0) {
          partialResults = reorderResultsExactFirst(partialResults, termLower);
          const raw = (partial.data as any) || {};
          const payload = {
            ...raw,
            data: { ...(raw.data || {}), results: partialResults },
          };
          const transformed = transformSearchResponse(payload, lang);
          (transformed.metadata as any).isPartialSearch = true;
          return { data: transformed };
        }
        return { data: null as any };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
          const { data } = await queryFulfilled;
          dispatch(setDetailedWord(data));
        } catch (err: any) {
          if (err?.status !== 401) {
            const msg = err?.data?.message || "Failed to fetch details";
            dispatch(setError(msg));
          }
          dispatch(setDetailedWord(null));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    autocomplete: builder.query<
      | {
          id: string;
          word: string;
          eyuo?: string;
          eyuoKor?: string;
          photo?: string;
          score?: number;
        }[]
      | { requiresAuth: true },
      { q: string }
    >({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const q = encodeURIComponent(arg.q);
        const [urhobo, english, korean] = await Promise.all([
          baseQuery({
            url: `/word/search?mode=partial&lang=urhobo&q=${q}&limit=5`,
          }),
          baseQuery({
            url: `/word/search?mode=partial&reverse=true&lang=english&q=${q}&limit=5`,
          }),
          baseQuery({
            url: `/word/search?mode=phonetic&reverse=true&lang=korean&q=${q}&fuzziness=60&limit=5`,
          }),
        ]);
        if (urhobo.error && (urhobo.error as any).status === 401) {
          return { data: { requiresAuth: true } };
        }
        const urhoboData = (urhobo.data as any)?.data?.results || [];
        const englishData = (english.data as any)?.data?.results || [];
        const koreanData = (korean.data as any)?.data?.results || [];
        const all = [...urhoboData, ...englishData, ...koreanData];
        const suggestions = all.map((item: any) => {
          const wordData = item.word || {};
          const engHeadword = wordData.efaEng?.[0]?.otaWord;
          const engHeadWords = wordData.efaEng?.map(
            (item: any) => item.otaWord,
          );
          const korHeadword = wordData.efaKor?.[0]?.otaWord;

          return {
            id: wordData.id,
            // Always use Urhobo ota as the base headword
            word: wordData.ota,
            // Matched/translation side shown on the left of the suggestion:
            // prefer English if present, otherwise Korean, otherwise undefined.
            eyuo: engHeadword || korHeadword || undefined,
            eyuoEng: engHeadWords,
            // Korean translation when present (so Korean query can show "오늘 | inonẹ, nonẹ")
            eyuoKor: korHeadword || undefined,
            photo: wordData.oho?.[0]?.oma?.[0]?.url || "/images/dish.svg",
            score: item.score,
          };
        });
        const unique = suggestions.filter(
          (v: any, i: number, a: any[]) =>
            a.findIndex((x) => x.word === v.word) === i,
        );
        return { data: unique };
      },
    }),

    wordsToReview: builder.query<
      { data: any[]; pagination: any },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/word/to-review-and-ratings?page=${page}&limit=${limit}`,
      }),
      transformResponse: (response: any) => ({
        data: response?.data?.data ?? [],
        pagination: response?.data?.pagination ?? {},
      }),
      providesTags: ["Word"],
    }),

    wordById: builder.query<any, string>({
      query: (id) => ({ url: `/word/${id}` }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (_result, _err, id) => [{ type: "Word", id }],
    }),

    submitWordReview: builder.mutation<
      { message: string },
      { wordId: string; rating: number; review: string }
    >({
      query: ({ wordId, rating, review }) => ({
        url: `/words/${wordId}/review`,
        method: "POST",
        body: { rating, review },
      }),
      invalidatesTags: (_result, _err, { wordId }) => [
        { type: "Word", id: wordId },
        { type: "Word", id: `reviews-${wordId}` },
        "Word",
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Review submitted successfully");
        } catch (err: unknown) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ||
            "Failed to submit review";
          toast.error(msg);
        }
      },
    }),

    searchWords: builder.query<
      any,
      {
        q: string;
        mode?: string;
        lang?: string;
        limit?: number;
        offset?: number;
        fuzziness?: number;
        reverse?: boolean;
      }
    >({
      query: (params) => ({ url: "/word/search", params }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: unknown) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ||
            "Search failed";
          toast.error(msg);
        }
      },
    }),
    wordCountTotal: builder.query<{ data: number; message: string }, void>({
      query: () => ({ url: "/word/count/total" }),
    }),

    newlyCoinedWords: builder.query<
      {
        id: string;
        ota: string;
        status: string;
        createdAt: string;
        oho?: Array<{ upho?: string; uphoesio?: string }>;
      }[],
      void
    >({
      query: () => ({ url: "/word/newly-coined-words" }),
      transformResponse: (response: any) => {
        return response?.data || [];
      },
    }),

    getAllWords: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        status?: string;
        createdBy?: string;
        sortDir?: string;
        hasAudio?: string;
        hasImage?: string;
      }
    >({
      query: (params) => ({
        url: "/word",
        params: {
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.search && { search: params.search }),
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.status && { status: params.status }),
          ...(params.createdBy && { createdBy: params.createdBy }),
          ...(params.sortDir && { sortDir: params.sortDir }),
          ...(params.hasAudio && { hasAudio: params.hasAudio }),
          ...(params.hasImage && { hasImage: params.hasImage }),
        },
      }),
    }),

    // Get reviews for a word
    getWordReviews: builder.query<
      {
        data: Array<{
          id: string;
          userId: string;
          wordId: string;
          parentId: string | null;
          rating: number;
          review: string;
          isReply: boolean;
          createdAt: string;
          updatedAt: string;
        }>;
        message: string;
      },
      string
    >({
      query: (wordId: string) => ({ url: `/words/${wordId}/reviews` }),
      transformResponse: (response: any) => {
        return response || { data: [], message: "" };
      },
      providesTags: (_result, _err, wordId) => [
        { type: "Word", id: `reviews-${wordId}` },
      ],
    }),

    // Reply to a review
    replyToReview: builder.mutation<
      any,
      { review: string; parentId: string; wordId: string }
    >({
      query: ({
        review,
        parentId,
        wordId,
      }: {
        review: string;
        parentId: string;
        wordId: string;
      }) => ({
        url: "/words/review/reply",
        method: "POST",
        body: { review, parentId, wordId },
      }),
      invalidatesTags: (_result, _err, { wordId }) => [
        { type: "Word", id: `reviews-${wordId}` },
      ],
    }),

    // Favorites
    addFavorite: builder.mutation<
      { data: { id: string; userId: string; wordId: string; createdAt: string }; message: string },
      { wordId: string }
    >({
      query: ({ wordId }) => ({
        url: `/words/${wordId}/Favorites`,
        method: "POST",
      }),
      invalidatesTags: ["Word"],
    }),

    getFavorites: builder.query<
      { data: Array<{ id: string; word: { id: string; ota: string } }>; message: string },
      void
    >({
      query: () => ({ url: "/words/Favorites" }),
      providesTags: ["Word"],
    }),

    removeFavorite: builder.mutation<
      { message: string },
      { wordId: string }
    >({
      query: ({ wordId }) => ({
        url: `/words/${wordId}/Favorites`,
        method: "DELETE",
      }),
      invalidatesTags: ["Word"],
    }),

  }),
});

export const {
  useWordOfDayQuery,
  useLazyWordOfDayQuery,
  useLazyGetWordDetailsQuery,
  useAutocompleteQuery,
  useLazyAutocompleteQuery,
  useWordsToReviewQuery,
  useLazyWordsToReviewQuery,
  useWordByIdQuery,
  useLazyWordByIdQuery,
  useSubmitWordReviewMutation,
  useLazySearchWordsQuery,
  useWordCountTotalQuery,
  useNewlyCoinedWordsQuery,
  useGetAllWordsQuery,
  useLazyGetAllWordsQuery,
  useGetWordReviewsQuery,
  useLazyGetWordReviewsQuery,
  useReplyToReviewMutation,
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} = wordEndpoints;
