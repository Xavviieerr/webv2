import { apiSlice } from "@/slice/requestSlice";
import type { PlaceListItem } from "@/features/dashboard/places/types";

type SearchResult = { word: any; score: number };

type FigureItem = { id: string; fullName: string; [key: string]: any };
type NameItem = { id: string; [key: string]: any };

export const searchApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		searchWordsResults: builder.query<
			SearchResult[],
			{
				q: string;
				lang?: string;
				mode?: string;
				limit?: string;
				reverse?: boolean;
			}
		>({
			query: ({
				q,
				lang = "any",
				mode = "partial",
				limit = "10",
				reverse = false,
			}) => ({
				url: "/word/search",
				params: { q, lang, mode, limit, ...(reverse && { reverse: true }) },
			}),
			transformResponse: (response: any) => response?.data?.results ?? [],
		}),

		singleWordResult: builder.query<SearchResult[], { q: string }>({
			query: ({ q }) => ({
				url: "/word/search",
				params: { q, mode: "exact", lang: "urhobo" },
			}),
			transformResponse: (response: any) => response?.data?.results ?? [],
		}),

		searchFiguresList: builder.query<
			FigureItem[],
			{ search: string; limit?: string }
		>({
			query: ({ search, limit = "10" }) => ({
				url: "/figures",
				params: { search, limit, sortBy: "fullName", sortDir: "ASC" },
			}),
			transformResponse: (response: any) => {
				const data = response?.data;
				if (Array.isArray(data)) return data;
				return data?.items ?? [];
			},
		}),

		searchNamesList: builder.query<
			NameItem[],
			{ search: string; limit?: string }
		>({
			query: ({ search, limit = "10" }) => ({
				url: "/names",
				params: { search, limit },
			}),
			transformResponse: (response: any) => {
				const data = response?.data;
				if (Array.isArray(data)) return data;
				return data?.items ?? [];
			},
		}),

		searchPlacesList: builder.query<
			PlaceListItem[],
			{ search: string; limit?: string }
		>({
			query: ({ search, limit = "10" }) => ({
				url: "/places",
				params: { search, limit, status: "approved" },
			}),
			transformResponse: (response: any) => {
				const data = response?.data;
				if (Array.isArray(data)) return data;
				return data?.items ?? [];
			},
		}),

		getSingleFigure: builder.query<any, string>({
			query: (id) => ({ url: `/figures/${id}` }),
			transformResponse: (response: any) => response?.data ?? null,
		}),

		getSingleName: builder.query<any, string>({
			query: (id) => ({ url: `/names/${id}` }),
			transformResponse: (response: any) => response?.data ?? null,
		}),

		figureCountTotal: builder.query<{ data: number; message: string }, void>({
			query: () => ({ url: "/figures/count/total" }),
		}),

		nameCountTotal: builder.query<{ data: number; message: string }, void>({
			query: () => ({ url: "/names/count/total" }),
		}),
	}),
});

export const {
	useLazySearchWordsResultsQuery,
	useSingleWordResultQuery,
	useLazySearchFiguresListQuery,
	useLazySearchNamesListQuery,
	useLazySearchPlacesListQuery,
	useGetSingleFigureQuery,
	useGetSingleNameQuery,
	useFigureCountTotalQuery,
	useNameCountTotalQuery,
} = searchApi;
