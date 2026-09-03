export interface CommunityPostAuthor {
  id: string;
  username: string;
  profilePictureUrl?: string;
}

export interface CommunityPostCategory {
  id: string;
  name: string;
}

export interface CommunityPostTag {
  id: string;
  name: string;
}

export interface CommunityPostMedia {
  id: string;
  url: string;
  isFeatured: boolean;
}

export interface CommunityPostListItem {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  author: CommunityPostAuthor;
  authorId?: string;
  category: CommunityPostCategory;
  tags: CommunityPostTag[];
  media?: CommunityPostMedia[];
  likedBy?: Array<{ id: string; username: string }>;
  published?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  likeCount: number;
  published: boolean;
  publishedAt: string | null;
  authorId: string;
  author?: CommunityPostAuthor;
  categoryId: string;
  category?: CommunityPostCategory;
  tags: CommunityPostTag[];
  media?: CommunityPostMedia[];
  likedBy?: Array<{ id: string; username: string }>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface CommunityTag {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateCommunityPostInput {
  title: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  media?: Array<{ type: "photo" | "video"; url: string }>;
}

export interface UpdateCommunityPostInput {
  title: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  media?: Array<{ type: "photo" | "video"; url: string }>;
}

export interface FlagCommunityPostInput {
  reporterId: string;
  targetType: "post";
  targetId: string;
  reason: string;
  description: string;
}

export interface CommunityComment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: CommunityPostAuthor;
  createdAt: string;
  updatedAt: string;
  replies?: CommunityNestedReply[];
}

export interface CommunityNestedReply {
  id: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
}

export interface CommunityReply {
  id: string;
  content: string;
  commentId: string;
  postId: string;
  authorId: string;
  author: CommunityPostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReplyInput {
  content: string;
  postId: string;
  commentId: string;
}

export interface CommunityPostsQueryParams {
  page?: number;
  limit?: number;
}

export interface CommunityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CommunityPostQueryResult {
  posts: CommunityPostListItem[];
  pagination: CommunityPagination;
}
