export { CommunityPage } from "./components/CommunityPage";
export { CommunityFeed } from "./components/CommunityFeed";
export { CommunityPostCard } from "./components/CommunityPostCard";
export { CommunityEmptyState } from "./components/CommunityEmptyState";
export { CommunitySkeleton } from "./components/CommunitySkeleton";
export { CreatePostModal } from "./components/CreatePostModal";
export { EditPostModal } from "./components/EditPostModal";
export { PostDetail } from "./components/PostDetail";
export { CommentsSection } from "./components/CommentsSection";
export { CommentItem } from "./components/CommentItem";
export { CommentComposer } from "./components/CommentComposer";
export { ComposePost } from "./components/ComposePost";

export { EmojiPicker } from "./components/compose/EmojiPicker";
export { StatusDropdown } from "./components/compose/StatusDropdown";
export { ImagePreview } from "./components/compose/ImagePreview";

export { ReplyComposer } from "./components/ReplyComposer";
export { PostActions } from "./components/PostActions";
export { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";
export { ReportPostModal } from "./components/ReportPostModal";
export { UserPostsFeed } from "./components/UserPostsFeed";
export { CommunitySidebar } from "./components/CommunitySidebar";
export { WordOfDayCard } from "./components/WordOfDayCard";
export { NotableFigureCard } from "./components/NotableFigureCard";
export { RandomPlaceCard } from "./components/RandomPlaceCard";

export { useCommunityPosts } from "./hooks/useCommunityPosts";
export { useCreatePost } from "./hooks/useCreatePost";
export { useUserPosts } from "./hooks/useUserPosts";

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
} from "./api/communityEndpoints";

export type {
  CommunityPost,
  CommunityPostListItem,
  CommunityPostAuthor,
  CommunityPostCategory,
  CommunityPostTag,
  CommunityCategory,
  CommunityTag,
  CreateCommunityPostInput,
  UpdateCommunityPostInput,
  FlagCommunityPostInput,
  CommunityComment,
  CommunityNestedReply,
  CreateCommentInput,
  CommunityReply,
  CreateReplyInput,
  CommunityPostsQueryParams,
  CommunityPagination,
  CommunityPostQueryResult,
} from "./types";

export {
  COMMUNITY_PAGE_SIZE,
  POST_CONTENT_MAX_LENGTH,
  COMMENT_MAX_LENGTH,
  REPLY_MAX_LENGTH,
  COMMUNITY_COLORS,
  QUICK_EMOJIS,
} from "./constants";

export {
  insertBold,
  insertItalic,
  insertCode,
  insertList,
  insertMarkdown,
  renderMarkdown,
} from "./lib/format-text";

export {
  createPostSchema,
  updatePostSchema,
  commentSchema,
  replySchema,
  flagPostSchema,
} from "./schemas/communitySchema";

export type {
  CreatePostInput,
  UpdatePostInput,
  CommentInput,
  ReplyInput,
  FlagPostInput,
} from "./schemas/communitySchema";
