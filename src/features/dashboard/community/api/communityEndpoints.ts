import { apiSlice } from "@/slice/requestSlice";
import type { RootState } from "@/store/store";
import type {
  CommunityPostListItem,
  CommunityPost,
  CommunityPostsQueryParams,
  CommunityPostQueryResult,
  CommunityCategory,
  CommunityTag,
  CommunityComment,
  CommunityReply,
  CreateCommunityPostInput,
  UpdateCommunityPostInput,
  FlagCommunityPostInput,
  CreateCommentInput,
  CreateReplyInput,
} from "../types";
import { COMMUNITY_PAGE_SIZE } from "../constants";

function extractPostList(raw: unknown): CommunityPostListItem[] {
  if (Array.isArray(raw)) return raw;
  const obj = raw as Record<string, unknown>;
  const data = obj?.data;
  if (Array.isArray(data)) return data as CommunityPostListItem[];
  if (data && typeof data === "object" && "items" in (data as Record<string, unknown>)) {
    return (data as Record<string, unknown>).items as CommunityPostListItem[];
  }
  return [];
}

function extractPagination(raw: unknown, fallbackTotal: number) {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const inner = obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)
    ? (obj.data as Record<string, unknown>)
    : {};
  return {
    total: (inner.total ?? obj.total ?? fallbackTotal) as number,
    page: (inner.page ?? obj.page ?? 1) as number,
    limit: (inner.limit ?? obj.limit ?? COMMUNITY_PAGE_SIZE) as number,
    totalPages: (inner.totalPages ?? obj.totalPages ?? 1) as number,
  };
}

export const communityEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityPosts: builder.query<CommunityPostQueryResult, CommunityPostsQueryParams>({
      query: (params: CommunityPostsQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params.page ?? 1));
        searchParams.set("limit", String(params.limit ?? COMMUNITY_PAGE_SIZE));
        return `/community/posts?${searchParams.toString()}`;
      },
      transformResponse: (response: unknown) => {
        try {
          const res = response as { data: CommunityPostListItem[] | { data: CommunityPostListItem[] } & Record<string, unknown>; message?: string };
          const posts = extractPostList(res);
          const pagination = extractPagination(res, posts.length);
          const page = pagination.page;
          const limit = pagination.limit;
          const total = pagination.total;
          const totalPages = pagination.totalPages;
          return {
            posts,
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          };
        } catch {
          return {
            posts: [],
            pagination: {
              page: 1,
              limit: COMMUNITY_PAGE_SIZE,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map((p) => ({
                type: "CommunityPost" as const,
                id: p.id,
              })),
              { type: "CommunityPost" as const, id: "LIST" },
            ]
          : [{ type: "CommunityPost" as const, id: "LIST" }],
    }),

    getCommunityPost: builder.query<CommunityPost, string>({
      query: (id: string) => `/community/posts/${id}`,
      transformResponse: (response: unknown) => {
        const raw = response as Record<string, unknown>;
        const outerData = raw?.data;
        if (outerData && typeof outerData === "object" && "data" in outerData) {
          return (outerData as Record<string, unknown>).data as CommunityPost;
        }
        return outerData as CommunityPost;
      },
      providesTags: (_result, _err, id) => [{ type: "CommunityPost", id }],
    }),

    getUserPosts: builder.query<CommunityPostQueryResult, CommunityPostsQueryParams>({
      query: (params: CommunityPostsQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params.page ?? 1));
        searchParams.set("limit", String(params.limit ?? COMMUNITY_PAGE_SIZE));
        return `/community/posts/user/posts?${searchParams.toString()}`;
      },
      transformResponse: (response: unknown) => {
        try {
          const res = response as { data: CommunityPostListItem[] | { data: CommunityPostListItem[] } & Record<string, unknown>; message?: string };
          const posts = extractPostList(res);
          const pagination = extractPagination(res, posts.length);
          return {
            posts,
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.totalPages,
              hasNext: pagination.page < pagination.totalPages,
              hasPrev: pagination.page > 1,
            },
          };
        } catch {
          return {
            posts: [],
            pagination: {
              page: 1,
              limit: COMMUNITY_PAGE_SIZE,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map((p) => ({
                type: "CommunityPost" as const,
                id: p.id,
              })),
              { type: "CommunityPost" as const, id: "USER_POSTS" },
            ]
          : [{ type: "CommunityPost" as const, id: "USER_POSTS" }],
    }),

    getCategories: builder.query<CommunityCategory[], void>({
      query: () => "/posts/categories",
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityCategory[]; message?: string };
        return raw?.data ?? [];
      },
      providesTags: [{ type: "CommunityPost", id: "CATEGORIES" }],
    }),

    getTags: builder.query<CommunityTag[], void>({
      query: () => "/posts/tags",
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityTag[]; message?: string };
        return raw?.data ?? [];
      },
      providesTags: [{ type: "CommunityPost", id: "TAGS" }],
    }),

    createPost: builder.mutation<CommunityPost, CreateCommunityPostInput>({
      query: (body: CreateCommunityPostInput) => ({
        url: "/community/posts",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      invalidatesTags: [
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id: "USER_POSTS" },
      ],
    }),

    updatePost: builder.mutation<CommunityPost, { id: string; body: UpdateCommunityPostInput }>({
      query: ({ id, body }) => ({
        url: `/community/posts/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      invalidatesTags: (_result, _err, { id }) => [
        { type: "CommunityPost", id },
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id: "USER_POSTS" },
      ],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/community/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "CommunityPost", id },
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id: "USER_POSTS" },
      ],
    }),

    publishPost: builder.mutation<CommunityPost, string>({
      query: (id: string) => ({
        url: `/community/posts/${id}/publish`,
        method: "PATCH",
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      invalidatesTags: (_result, _err, id) => [
        { type: "CommunityPost", id },
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id: "USER_POSTS" },
      ],
    }),

    unpublishPost: builder.mutation<CommunityPost, string>({
      query: (id: string) => ({
        url: `/community/posts/${id}/unpublish`,
        method: "PATCH",
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      invalidatesTags: (_result, _err, id) => [
        { type: "CommunityPost", id },
        { type: "CommunityPost", id: "LIST" },
        { type: "CommunityPost", id: "USER_POSTS" },
      ],
    }),

    likePost: builder.mutation<CommunityPost, string>({
      query: (id: string) => ({
        url: `/community/posts/${id}/like`,
        method: "PATCH",
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      onQueryStarted: async (postId, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState;
        const userId = (state as any).auth?.user?.id as string | undefined;
        if (!userId) return;

        const patchResults: ReturnType<typeof dispatch>[] = [];

        const apiState = (state as any)[apiSlice.reducerPath];
        const queries: Record<string, { endpointName?: string; originalArgs?: unknown }> = apiState?.queries ?? {};
        Object.values(queries).forEach((q) => {
          if (q.endpointName === "getCommunityPosts" && q.originalArgs) {
            patchResults.push(
              dispatch(
                communityEndpoints.util.updateQueryData(
                  "getCommunityPosts",
                  q.originalArgs as CommunityPostsQueryParams,
                  (draft) => {
                    const post = draft.posts.find((p) => p.id === postId);
                    if (post) {
                      if (!post.likedBy) post.likedBy = [];
                      if (!post.likedBy.some((u) => u.id === userId)) post.likedBy.push({ id: userId, username: "" });
                      post.likeCount = (post.likeCount ?? 0) + 1;
                    }
                  }
                )
              )
            );
          }
          if (q.endpointName === "getUserPosts" && q.originalArgs) {
            patchResults.push(
              dispatch(
                communityEndpoints.util.updateQueryData(
                  "getUserPosts",
                  q.originalArgs as CommunityPostsQueryParams,
                  (draft) => {
                    const post = draft.posts.find((p) => p.id === postId);
                    if (post) {
                      if (!post.likedBy) post.likedBy = [];
                      if (!post.likedBy.some((u) => u.id === userId)) post.likedBy.push({ id: userId, username: "" });
                      post.likeCount = (post.likeCount ?? 0) + 1;
                    }
                  }
                )
              )
            );
          }
        });

        patchResults.push(
          dispatch(
            communityEndpoints.util.updateQueryData("getCommunityPost", postId, (draft) => {
              if (draft) {
                if (!draft.likedBy) draft.likedBy = [];
                if (!draft.likedBy.some((u) => u.id === userId)) draft.likedBy.push({ id: userId, username: "" });
                draft.likeCount = (draft.likeCount ?? 0) + 1;
              }
            })
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => {
            if (p && typeof p === "object" && "undo" in p) (p as { undo: () => void }).undo();
          });
        }
      },
    }),

    unlikePost: builder.mutation<CommunityPost, string>({
      query: (id: string) => ({
        url: `/community/posts/${id}/unlike`,
        method: "PATCH",
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityPost; message?: string };
        return raw?.data ?? (raw as unknown as CommunityPost);
      },
      onQueryStarted: async (postId, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState;
        const userId = (state as any).auth?.user?.id as string | undefined;
        if (!userId) return;

        const patchResults: ReturnType<typeof dispatch>[] = [];

        const apiState = (state as any)[apiSlice.reducerPath];
        const queries: Record<string, { endpointName?: string; originalArgs?: unknown }> = apiState?.queries ?? {};
        Object.values(queries).forEach((q) => {
          if (q.endpointName === "getCommunityPosts" && q.originalArgs) {
            patchResults.push(
              dispatch(
                communityEndpoints.util.updateQueryData(
                  "getCommunityPosts",
                  q.originalArgs as CommunityPostsQueryParams,
                  (draft) => {
                    const post = draft.posts.find((p) => p.id === postId);
                    if (post) {
                      if (!post.likedBy) post.likedBy = [];
                      post.likedBy = post.likedBy.filter((u) => u.id !== userId);
                      post.likeCount = Math.max((post.likeCount ?? 1) - 1, 0);
                    }
                  }
                )
              )
            );
          }
          if (q.endpointName === "getUserPosts" && q.originalArgs) {
            patchResults.push(
              dispatch(
                communityEndpoints.util.updateQueryData(
                  "getUserPosts",
                  q.originalArgs as CommunityPostsQueryParams,
                  (draft) => {
                    const post = draft.posts.find((p) => p.id === postId);
                    if (post) {
                      if (!post.likedBy) post.likedBy = [];
                      post.likedBy = post.likedBy.filter((u) => u.id !== userId);
                      post.likeCount = Math.max((post.likeCount ?? 1) - 1, 0);
                    }
                  }
                )
              )
            );
          }
        });

        patchResults.push(
          dispatch(
            communityEndpoints.util.updateQueryData("getCommunityPost", postId, (draft) => {
              if (draft) {
                if (!draft.likedBy) draft.likedBy = [];
                draft.likedBy = draft.likedBy.filter((u) => u.id !== userId);
                draft.likeCount = Math.max((draft.likeCount ?? 1) - 1, 0);
              }
            })
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => {
            if (p && typeof p === "object" && "undo" in p) (p as { undo: () => void }).undo();
          });
        }
      },
    }),

    flagPost: builder.mutation<void, FlagCommunityPostInput>({
      query: (body: FlagCommunityPostInput) => ({
        url: "/community/posts/flag",
        method: "POST",
        body,
      }),
    }),

    getPostComments: builder.query<CommunityComment[], string>({
      query: (postId: string) => `/posts/comments/post/${postId}`,
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityComment[]; message?: string };
        return raw?.data ?? [];
      },
      providesTags: (_result, _err, postId) => [
        { type: "CommunityComment", id: `POST_${postId}` },
      ],
    }),

    createComment: builder.mutation<CommunityComment, CreateCommentInput>({
      query: (body: CreateCommentInput) => ({
        url: "/posts/comments",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityComment; message?: string };
        return raw?.data ?? (raw as unknown as CommunityComment);
      },
      invalidatesTags: (_result, _err, { postId }) => [
        { type: "CommunityComment", id: `POST_${postId}` },
      ],
    }),

    updateComment: builder.mutation<CommunityComment, { id: string; content: string; postId: string }>({
      query: ({ id, content, postId }) => ({
        url: `/posts/comments/${id}`,
        method: "PATCH",
        body: { content, postId },
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityComment; message?: string };
        return raw?.data ?? (raw as unknown as CommunityComment);
      },
      invalidatesTags: (_result, _err, { postId }) => [
        { type: "CommunityComment", id: `POST_${postId}` },
      ],
    }),

    deleteComment: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: `/posts/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { postId }) => [
        { type: "CommunityComment", id: `POST_${postId}` },
      ],
    }),

    getReplies: builder.query<CommunityReply[], string>({
      query: (commentId: string) => `/comments/replies/${commentId}`,
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityReply[]; message?: string };
        return raw?.data ?? [];
      },
      providesTags: (_result, _err, commentId) => [
        { type: "CommunityReply", id: `COMMENT_${commentId}` },
      ],
    }),

    createReply: builder.mutation<CommunityReply, CreateReplyInput>({
      query: (body: CreateReplyInput) => ({
        url: "/comments/replies",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityReply; message?: string };
        return raw?.data ?? (raw as unknown as CommunityReply);
      },
      invalidatesTags: (_result, _err, { commentId }) => [
        { type: "CommunityReply", id: `COMMENT_${commentId}` },
      ],
    }),

    updateReply: builder.mutation<CommunityReply, { replyId: string; content: string }>({
      query: ({ replyId, content }) => ({
        url: `/comments/replies/${replyId}`,
        method: "PATCH",
        body: { content },
      }),
      transformResponse: (response: unknown) => {
        const raw = response as { data: CommunityReply; message?: string };
        return raw?.data ?? (raw as unknown as CommunityReply);
      },
      invalidatesTags: (_result, _err, { replyId }) => [
        { type: "CommunityReply", id: replyId },
      ],
    }),

    deleteReply: builder.mutation<void, { replyId: string; commentId: string }>({
      query: ({ replyId }) => ({
        url: `/comments/replies/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { commentId }) => [
        { type: "CommunityReply", id: `COMMENT_${commentId}` },
      ],
    }),

    uploadPostImage: builder.mutation<
      { thumbnail: string; small: string; medium: string; large: string; original: string },
      File
    >({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append("imageFile", imageFile);
        return {
          url: "/community/posts/image/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
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
  useUploadPostImageMutation,
} = communityEndpoints;
