"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useCreateCommentMutation } from "../api/communityEndpoints";
import { COMMENT_MAX_LENGTH } from "../constants";
import { commentSchema } from "../schemas/communitySchema";

interface CommentComposerProps {
  postId: string;
}

export function CommentComposer({ postId }: CommentComposerProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const result = commentSchema.safeParse({ content });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Comment cannot be empty");
        return;
      }

      try {
        await createComment({ content: result.data.content, postId }).unwrap();
        setContent("");
        toast.success(t("commentPosted", "Comment posted"));
      } catch (err: unknown) {
        const apiError = err as { data?: { message?: string }; message?: string };
        toast.error(apiError?.data?.message || apiError?.message || "Failed to post comment");
      }
    },
    [createComment, postId, content, t],
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      {user?.profilePictureUrl ? (
        <img
          src={user.profilePictureUrl}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-xs font-semibold shrink-0">
          {user?.username?.charAt(0).toUpperCase() ?? "U"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder={t("writeComment", "Write a comment...")}
          className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-[#0D4D4D]/40">
            {content.length}/{COMMENT_MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("posting", "Posting...") : t("post", "Post")}
          </button>
        </div>
      </div>
    </form>
  );
}
