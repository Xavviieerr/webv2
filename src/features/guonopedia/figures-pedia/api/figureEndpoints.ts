import { apiSlice } from "@/slice/requestSlice";

export type SuggestFigureRequest = {
  fullName: string;
  occupation: string;
  shortBio: string;
  introBio: string;
  nationality?: string;
  ethnicity?: string;
  suggestionNote?: string;
};

export type SuggestFigureResponse = {
  data: {
    id: string;
    fullName: string;
    slug: string;
    shortBio: string;
    introBio: string;
    nationality: string | null;
    ethnicity: string | null;
    occupation: string;
    status: string;
    submissionType: string;
    suggestionNote: string | null;
    createdAt: string;
  };
  message: string;
};

export const figureEndpoints = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    suggestFigure: builder.mutation<SuggestFigureResponse, SuggestFigureRequest>({
      query: (body) => ({
        url: "/figures/suggest",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSuggestFigureMutation } = figureEndpoints;
