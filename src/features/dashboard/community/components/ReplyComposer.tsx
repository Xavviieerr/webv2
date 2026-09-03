"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useCreateReplyMutation } from "../api/communityEndpoints";
import { REPLY_MAX_LENGTH } from "../constants";
import { replySchema } from "../schemas/communitySchema";

interface ReplyComposerProps {
  postId: string;
  commentId: string;
  onClose: () => void;
}

export function ReplyComposer({ postId, commentId, onClose }: ReplyComposerProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [createReply, { isLoading }] = useCreateReplyMutation();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const result = replySchema.safeParse({ content });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Reply cannot be empty");
        return;
      }

      try {
        await createReply({ content: result.data.content, postId, commentId }).unwrap();
        setContent("");
        onClose();
        toast.success(t("replyPosted", "Reply posted"));
      } catch (err: unknown) {
        const apiError = err as { data?: { message?: string }; message?: string };
        toast.error(apiError?.data?.message || apiError?.message || "Failed to post reply");
      }
    },
    [createReply, postId, commentId, content, t, onClose],
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3 mt-3 ml-8">
      <div className="w-7 h-7 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-[10px] font-semibold shrink-0">
        {user?.username?.charAt(0).toUpperCase() ?? "U"}
      </div>
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          maxLength={REPLY_MAX_LENGTH}
          placeholder={t("writeReply", "Write a reply...")}
          className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex items-center justify-end gap-2 mt-1.5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#0D4D4D]/50 hover:text-[#0D4D4D] font-medium transition-colors"
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("posting", "Posting...") : t("reply", "Reply")}
          </button>
        </div>
      </div>
    </form>
  );
}
