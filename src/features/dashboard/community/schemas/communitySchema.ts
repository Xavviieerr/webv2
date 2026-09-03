import { z } from "zod";
import {
	POST_CONTENT_MAX_LENGTH,
	COMMENT_MAX_LENGTH,
	REPLY_MAX_LENGTH,
} from "../constants";

export const createPostSchema = z.object({
	content: z
		.string()
		.min(1, "Content is required")
		.max(POST_CONTENT_MAX_LENGTH, `Content must be ${POST_CONTENT_MAX_LENGTH} characters or less`),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
	content: z
		.string()
		.min(1, "Content is required")
		.max(POST_CONTENT_MAX_LENGTH, `Content must be ${POST_CONTENT_MAX_LENGTH} characters or less`),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const commentSchema = z.object({
	content: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(COMMENT_MAX_LENGTH, `Comment must be ${COMMENT_MAX_LENGTH} characters or less`),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const replySchema = z.object({
	content: z
		.string()
		.min(1, "Reply cannot be empty")
		.max(REPLY_MAX_LENGTH, `Reply must be ${REPLY_MAX_LENGTH} characters or less`),
});

export type ReplyInput = z.infer<typeof replySchema>;

export const flagPostSchema = z.object({
	reason: z.string().min(1, "Reason is required"),
	description: z.string().min(1, "Description is required"),
});

export type FlagPostInput = z.infer<typeof flagPostSchema>;
