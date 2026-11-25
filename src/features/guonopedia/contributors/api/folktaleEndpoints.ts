import { apiSlice } from "@/slice/requestSlice";
import type {
	CreateFolktalePayload,
	CreateFolktaleResponse,
	FolktaleDetail,
	FolktaleDetailResponse,
	FolktaleListData,
	FolktaleListParams,
	FolktaleListResponse,
} from "../types/folktales";
import { FOLKTALE_PAGE_SIZE } from "../constants/folktales";

const EMPTY_LIST: FolktaleListData = {
	items: [],
	total: 0,
	totalPages: 0,
	hasNext: false,
	hasPrev: false,
	page: 1,
	limit: FOLKTALE_PAGE_SIZE,
};

function extractFolktaleList(response: unknown): FolktaleListData {
	const res = response as FolktaleListResponse | undefined;
	if (res?.data && Array.isArray(res.data.items)) {
		return res.data;
	}
	return EMPTY_LIST;
}

export const folktaleEndpoints = apiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		getMyFolktales: builder.query<FolktaleListData, FolktaleListParams>({
			query: (params = {}) => {
				const searchParams = new URLSearchParams();
				searchParams.set("page", String(params.page ?? 1));
				searchParams.set(
					"limit",
					String(params.limit ?? FOLKTALE_PAGE_SIZE),
				);
				if (params.type) searchParams.set("type", params.type);
				if (params.status) searchParams.set("status", params.status);
				return { url: `/folktales/mine?${searchParams.toString()}` };
			},
			transformResponse: (response: unknown) =>
				extractFolktaleList(response),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({
								type: "Folktale" as const,
								id,
							})),
							{ type: "Folktale" as const, id: "MINE" },
						]
					: [{ type: "Folktale" as const, id: "MINE" }],
		}),

		getMyFolktale: builder.query<FolktaleDetail, string>({
			query: (folktaleId) => ({ url: `/folktales/${folktaleId}/mine` }),
			transformResponse: (response: unknown) => {
				const res = response as FolktaleDetailResponse | undefined;
				return (res?.data ?? res) as FolktaleDetail;
			},
			providesTags: (_result, _error, folktaleId) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		createFolktale: builder.mutation<
			CreateFolktaleResponse,
			CreateFolktalePayload
		>({
			query: (body) => ({
				url: "/folktales",
				method: "POST",
				body,
			}),
			invalidatesTags: [
				{ type: "Folktale", id: "MINE" },
				{ type: "Contributor", id: "SCOPES" },
			],
		}),

		updateFolktale: builder.mutation<
			FolktaleDetailResponse,
			{ folktaleId: string; body: CreateFolktalePayload }
		>({
			query: ({ folktaleId, body }) => ({
				url: `/folktales/${folktaleId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
				{ type: "Folktale", id: "MINE" },
			],
		}),

		submitFolktale: builder.mutation<FolktaleDetailResponse, string>({
			query: (folktaleId) => ({
				url: `/folktales/${folktaleId}/submit`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, folktaleId) => [
				{ type: "Folktale", id: folktaleId },
				{ type: "Folktale", id: "MINE" },
				{ type: "Contributor", id: "SCOPES" },
			],
		}),

		withdrawFolktale: builder.mutation<FolktaleDetailResponse, string>({
			query: (folktaleId) => ({
				url: `/folktales/${folktaleId}/withdraw`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, folktaleId) => [
				{ type: "Folktale", id: folktaleId },
				{ type: "Folktale", id: "MINE" },
				{ type: "Contributor", id: "SCOPES" },
			],
		}),

		deleteFolktale: builder.mutation<{ message?: string }, string>({
			query: (folktaleId) => ({
				url: `/folktales/${folktaleId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, folktaleId) => [
				{ type: "Folktale", id: folktaleId },
				{ type: "Folktale", id: "MINE" },
				{ type: "Contributor", id: "SCOPES" },
			],
		}),

		createFolktaleCharacter: builder.mutation<
			unknown,
			{
				folktaleId: string;
				body: {
					name: string;
					localName?: string;
					role?: string;
					description?: string;
					order: number;
				};
			}
		>({
			query: ({ folktaleId, body }) => ({
				url: `/folktales/${folktaleId}/characters`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		updateFolktaleCharacter: builder.mutation<
			unknown,
			{ folktaleId: string; characterId: string; body: unknown }
		>({
			query: ({ folktaleId, characterId, body }) => ({
				url: `/folktales/${folktaleId}/characters/${characterId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		deleteFolktaleCharacter: builder.mutation<
			unknown,
			{ folktaleId: string; characterId: string }
		>({
			query: ({ folktaleId, characterId }) => ({
				url: `/folktales/${folktaleId}/characters/${characterId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		createFolktaleGlossary: builder.mutation<
			unknown,
			{ folktaleId: string; body: unknown }
		>({
			query: ({ folktaleId, body }) => ({
				url: `/folktales/${folktaleId}/glossary`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		updateFolktaleGlossary: builder.mutation<
			unknown,
			{ folktaleId: string; glossaryId: string; body: unknown }
		>({
			query: ({ folktaleId, glossaryId, body }) => ({
				url: `/folktales/${folktaleId}/glossary/${glossaryId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),

		deleteFolktaleGlossary: builder.mutation<
			unknown,
			{ folktaleId: string; glossaryId: string }
		>({
			query: ({ folktaleId, glossaryId }) => ({
				url: `/folktales/${folktaleId}/glossary/${glossaryId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, { folktaleId }) => [
				{ type: "Folktale", id: folktaleId },
			],
		}),
	}),
});

export const {
	useGetMyFolktalesQuery,
	useGetMyFolktaleQuery,
	useCreateFolktaleMutation,
	useUpdateFolktaleMutation,
	useSubmitFolktaleMutation,
	useWithdrawFolktaleMutation,
	useDeleteFolktaleMutation,
	useCreateFolktaleCharacterMutation,
	useUpdateFolktaleCharacterMutation,
	useDeleteFolktaleCharacterMutation,
	useCreateFolktaleGlossaryMutation,
	useUpdateFolktaleGlossaryMutation,
	useDeleteFolktaleGlossaryMutation,
} = folktaleEndpoints;
