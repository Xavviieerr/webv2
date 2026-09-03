/**
 * Import all endpoint modules so they inject into apiSlice.
 * Re-export hooks for convenience.
 */
import "@/features/auth/api/authApi";
import "@/features/auth/api/passwordEndpoints";
import "@/features/auth/api/provinceEndpoints";
import "@/slice/userEndpoints";
import "../wordEndpoints";
import "@/slice/donationEndpoints";
import "@/slice/footballLeaguesSlice";
import "@/features/dashboard/notifications/api/notificationEndpoints";
import "@/features/dashboard/support/api/supportEndpoints";
import "@/features/dashboard/community/api/communityEndpoints";
import "@/features/dashboard/places/api/placeEndpoints";

export {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
} from "@/features/auth/api/authApi";

export {
  useVerifyUserMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from "@/features/auth/api/passwordEndpoints";

export {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} from "@/features/auth/api/provinceEndpoints";

export {
  useUpdateProfileImageMutation,
  useUpdateNameMutation,
  useUpdateUserNameMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useDeleteUserMutation,
} from "@/features/auth/api/userEndpoints";

export {
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
} from "../wordEndpoints";

export {
  useGetWalletAddressesQuery,
  useLazyGetWalletAddressesQuery,
  useSubmitDonationMutation,
} from "@/slice/donationEndpoints";

export {
  useGetFootballLeaguesQuery,
  useGetFootballFixturesQuery,
  useGetFootballLiveScoresQuery,
  useGetFootballLineupQuery,
  useGetFootballStandingsQuery,
} from "@/slice/footballLeaguesSlice";

export {
  useGetCommunityPostsQuery,
  useGetCommunityPostQuery,
  useGetUserPostsQuery,
  useGetCategoriesQuery,
  useGetTagsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  usePublishPostMutation,
  useUnpublishPostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFlagPostMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetRepliesQuery,
  useCreateReplyMutation,
  useUpdateReplyMutation,
  useDeleteReplyMutation,
} from "@/features/dashboard/community/api/communityEndpoints";
