import { apiSlice } from "@/slice/requestSlice";
import type {
	PlaceListResponse,
	PlaceDetailResponse,
	PlaceStatsResponse,
	PlaceCountResponse,
	PlaceImageUploadResponse,
	PlaceListParams,
	PlaceReviewParams,
	SuggestPlaceInput,
	ClaimPlaceInput,
	SubmitReviewInput,
	RespondToReviewInput,
	PlaceReview,
	PlaceBusinessProfile,
} from "../types";
import { PLACES_PAGE_SIZE } from "../constants";

function extractPlaceList(response: unknown): PlaceListResponse["data"] {
	const res = response as PlaceListResponse;
	if (res?.data && typeof res.data === "object" && "items" in res.data) {
		return res.data;
	}
	return { items: [], total: 0, page: 1, limit: PLACES_PAGE_SIZE, totalPages: 0, hasNext: false, hasPrev: false };
}

export const placeEndpoints = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPlaces: builder.query<PlaceListResponse["data"], PlaceListParams>({
			query: (params: PlaceListParams = {}) => {
				const searchParams = new URLSearchParams();
				searchParams.set("page", String(params.page ?? 1));
				searchParams.set("limit", String(params.limit ?? PLACES_PAGE_SIZE));
				if (params.search) searchParams.set("search", params.search);
				if (params.type) searchParams.set("type", params.type);
				if (params.status) searchParams.set("status", params.status);
				if (params.sortBy) searchParams.set("sortBy", params.sortBy);
				if (params.sortDir) searchParams.set("sortDir", params.sortDir.toUpperCase());
				return { url: `/places?${searchParams.toString()}` };
			},
			transformResponse: (response: unknown) => extractPlaceList(response),
			providesTags: (result) =>
				result?.items
					? [
							...result.items.map(({ id }) => ({ type: "Place" as const, id })),
							{ type: "Place", id: "LIST" },
						]
					: [{ type: "Place", id: "LIST" }],
		}),

		getPlaceById: builder.query<PlaceDetailResponse["data"], string>({
			query: (id) => ({ url: `/places/${id}` }),
			transformResponse: (response: unknown) => {
				const res = response as PlaceDetailResponse;
				return res?.data ?? res;
			},
			providesTags: (_result, _error, id) => [{ type: "Place", id }],
		}),

		placeCountTotal: builder.query<PlaceCountResponse, void>({
			query: () => ({ url: "/places/count/total" }),
		}),

		getPlaceStats: builder.query<PlaceStatsResponse["data"], void>({
			query: () => ({ url: "/places/stats" }),
			transformResponse: (response: unknown) => {
				const res = response as PlaceStatsResponse;
				return res?.data;
			},
		}),

		suggestPlace: builder.mutation<PlaceDetailResponse["data"], SuggestPlaceInput>({
			query: (body) => ({
				url: "/places/suggest",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Place", id: "LIST" }],
		}),

		updatePlace: builder.mutation<PlaceDetailResponse["data"], { id: string; body: Partial<SuggestPlaceInput> }>({
			query: ({ id, body }) => ({
				url: `/places/${id}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Place", id },
				{ type: "Place", id: "LIST" },
			],
		}),

		uploadPlaceImage: builder.mutation<PlaceImageUploadResponse, File>({
			query: (imageFile) => {
				const formData = new FormData();
				formData.append("imageFile", imageFile);
				return {
					url: "/places/image/upload",
					method: "POST",
					body: formData,
				};
			},
		}),

		uploadClaimDocument: builder.mutation<
			{ secure_url: string; public_id: string; resource_type: string },
			File
		>({
			query: (file) => {
				const formData = new FormData();
				formData.append("imageFile", file);
				return {
					url: "/places/image/upload",
					method: "POST",
					body: formData,
				};
			},
		}),

		updateBusinessProfile: builder.mutation<
			PlaceBusinessProfile,
			{
				placeId: string;
				body: {
					category?: string;
					phoneNumber?: string;
					email?: string;
					website?: string;
					logo?: string;
					openingHours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
				};
			}
		>({
			query: ({ placeId, body }) => ({
				url: `/places/${placeId}/business-profile`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { placeId }) => [
				{ type: "Place", id: placeId },
				{ type: "Place", id: "LIST" },
			],
		}),

		getPlaceReviews: builder.query<
			{ items: PlaceReview[]; total: number; page: number; totalPages: number },
			{ placeId: string; params?: PlaceReviewParams }
		>({
			query: ({ placeId, params = {} }) => {
				const searchParams = new URLSearchParams();
				searchParams.set("page", String(params.page ?? 1));
				searchParams.set("limit", String(params.limit ?? 10));
				if (params.sortBy) searchParams.set("sortBy", params.sortBy);
				if (params.sortDir) searchParams.set("sortDir", params.sortDir.toUpperCase());
				return { url: `/places/${placeId}/reviews?${searchParams.toString()}` };
			},
			transformResponse: (response: unknown) => {
				const res = response as { data: { items: PlaceReview[]; total: number; page: number; totalPages: number } };
				return res?.data ?? { items: [], total: 0, page: 1, totalPages: 0 };
			},
			providesTags: (_result, _error, { placeId }) => [{ type: "Place", id: placeId }],
		}),

		submitReview: builder.mutation<PlaceReview, { placeId: string; body: SubmitReviewInput }>({
			query: ({ placeId, body }) => ({
				url: `/places/${placeId}/reviews`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, { placeId }) => [
				{ type: "Place", id: placeId },
				{ type: "Place", id: "LIST" },
			],
		}),

		updateReview: builder.mutation<
			PlaceReview,
			{ placeId: string; reviewId: string; body: Partial<SubmitReviewInput> }
		>({
			query: ({ placeId, reviewId, body }) => ({
				url: `/places/${placeId}/reviews/${reviewId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { placeId }) => [
				{ type: "Place", id: placeId },
				{ type: "Place", id: "LIST" },
			],
		}),

		respondToReview: builder.mutation<
			PlaceReview,
			{ placeId: string; reviewId: string; body: RespondToReviewInput }
		>({
			query: ({ placeId, reviewId, body }) => ({
				url: `/places/${placeId}/reviews/${reviewId}/respond`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, { placeId }) => [{ type: "Place", id: placeId }],
		}),

		submitClaim: builder.mutation<PlaceClaim, { placeId: string; body: ClaimPlaceInput }>({
			query: ({ placeId, body }) => ({
				url: `/places/${placeId}/claim`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_result, _error, { placeId }) => [
				{ type: "Place", id: placeId },
				{ type: "Place", id: "LIST" },
				{ type: "Place", id: "CLAIMS" },
			],
		}),

		getPendingClaims: builder.query<
			{ items: PlaceClaim[]; total: number; page: number; totalPages: number },
			{ page?: number; limit?: number; status?: string }
		>({
			query: (params = {}) => {
				const searchParams = new URLSearchParams();
				searchParams.set("page", String(params.page ?? 1));
				searchParams.set("limit", String(params.limit ?? 20));
				if (params.status) searchParams.set("status", params.status);
				return { url: `/places/claims?${searchParams.toString()}` };
			},
			transformResponse: (response: unknown) => {
				const res = response as { data?: { items: PlaceClaim[]; total: number; page: number; totalPages: number }; items?: PlaceClaim[]; total?: number; page?: number; totalPages?: number };
				if (res?.data && typeof res.data === "object" && "items" in res.data) {
					return res.data;
				}
				if (res?.items) {
					return { items: res.items, total: res.total ?? 0, page: res.page ?? 1, totalPages: res.totalPages ?? 0 };
				}
				return { items: [], total: 0, page: 1, totalPages: 0 };
			},
			providesTags: [{ type: "Place", id: "CLAIMS" }],
		}),
	}),
});

import type { PlaceClaim } from "../types";

export const {
	useGetPlacesQuery,
	useLazyGetPlacesQuery,
	useGetPlaceByIdQuery,
	useLazyGetPlaceByIdQuery,
	usePlaceCountTotalQuery,
	useGetPlaceStatsQuery,
	useSuggestPlaceMutation,
	useUpdatePlaceMutation,
	useUploadPlaceImageMutation,
	useUploadClaimDocumentMutation,
	useUpdateBusinessProfileMutation,
	useGetPlaceReviewsQuery,
	useSubmitReviewMutation,
	useUpdateReviewMutation,
	useRespondToReviewMutation,
	useSubmitClaimMutation,
	useGetPendingClaimsQuery,
} = placeEndpoints;
