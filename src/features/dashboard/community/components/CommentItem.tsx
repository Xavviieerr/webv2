"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useUpdateCommentMutation, useDeleteCommentMutation } from "../api/communityEndpoints";
import { COMMENT_MAX_LENGTH } from "../constants";
import { formatRelativeTime } from "../utils";
import type { CommunityComment } from "../types";

interface CommentItemProps {
  comment: CommunityComment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? "");
  const [showReplies, setShowReplies] = useState(true);

  const authorName = comment.author?.username ?? "User";
  const authorAvatar = comment.author?.profilePictureUrl;
  const isOwner = user?.id === comment.authorId;
  const dateStr = comment.createdAt ? formatRelativeTime(comment.createdAt) : "";
  const replies = comment.replies ?? [];

  const handleSave = useCallback(async () => {
    if (!editContent.trim()) return;
    try {
      await updateComment({ id: comment.id, content: editContent, postId }).unwrap();
      setIsEditing(false);
      toast.success(t("commentUpdated", "Comment updated"));
    } catch {
      toast.error(t("failedToUpdateComment", "Failed to update comment"));
    }
  }, [updateComment, comment.id, postId, editContent, t]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteComment({ id: comment.id, postId }).unwrap();
      toast.success(t("commentDeleted", "Comment deleted"));
    } catch {
      toast.error(t("failedToDeleteComment", "Failed to delete comment"));
    }
  }, [deleteComment, comment.id, postId, t]);

  return (
    <div className="flex items-start gap-3">
      {authorAvatar ? (
        <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-xs font-semibold shrink-0">
          {authorName.charAt(0)?.toUpperCase() ?? "U"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#0D4D4D]">{authorName}</p>
          {dateStr && <span className="text-[11px] text-[#0D4D4D]/40">{dateStr}</span>}
          {isOwner && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button type="button" onClick={() => setIsEditing(!isEditing)} className="text-[11px] text-[#0D4D4D]/40 hover:text-[#0E808D] transition-colors">{t("edit", "Edit")}</button>
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="text-[11px] text-[#0D4D4D]/40 hover:text-red-500 transition-colors disabled:opacity-50">{t("delete", "Delete")}</button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1.5">
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} maxLength={COMMENT_MAX_LENGTH}
              className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none" />
            <div className="flex items-center justify-end gap-2 mt-1.5">
              <button type="button" onClick={() => { setIsEditing(false); setEditContent(comment.content ?? ""); }}
                className="text-[11px] text-[#0D4D4D]/50 hover:text-[#0D4D4D] font-medium transition-colors">{t("cancel", "Cancel")}</button>
              <button type="button" onClick={handleSave} disabled={isUpdating || !editContent.trim()}
                className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors disabled:opacity-50">
                {isUpdating ? t("saving", "Saving...") : t("save", "Save")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#0D4D4D]/70 mt-0.5">{comment.content}</p>
        )}

        {/* Replies from nested data */}
        {replies.length > 0 && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="text-[11px] text-[#0D4D4D]/50 hover:text-[#0E808D] font-medium transition-colors"
            >
              {showReplies
                ? t("hideReplies", "Hide replies")
                : `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
            </button>

            {showReplies && (
              <div className="mt-2 space-y-3">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3 ml-8">
                    <div className="w-7 h-7 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-[10px] font-semibold shrink-0">
                      {authorName.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0D4D4D]">{authorName}</p>
                      <p className="text-xs text-[#0D4D4D]/70 mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
