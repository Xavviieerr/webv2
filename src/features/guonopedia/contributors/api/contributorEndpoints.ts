import { apiSlice } from "@/slice/requestSlice";
import type {
	ApplyContributorPayload,
	ApplyContributorResponse,
	ContributorScopeRecord,
	ContributorScopesResponse,
} from "../types";

export const contributorEndpoints = apiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		applyAsContributor: builder.mutation<
			ApplyContributorResponse,
			ApplyContributorPayload
		>({
			query: (body) => ({
				url: "/contributors/contributor/apply",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Contributor", id: "SCOPES" }],
		}),

		getContributorScopes: builder.query<
			ContributorScopeRecord[],
			string
		>({
			query: (userId) => ({
				url: `/contributors/${userId}/scopes`,
			}),
			transformResponse: (response: ContributorScopesResponse) =>
				Array.isArray(response?.data) ? response.data : [],
			providesTags: [{ type: "Contributor", id: "SCOPES" }],
		}),
	}),
});

export const {
	useApplyAsContributorMutation,
	useGetContributorScopesQuery,
	useLazyGetContributorScopesQuery,
} = contributorEndpoints;
