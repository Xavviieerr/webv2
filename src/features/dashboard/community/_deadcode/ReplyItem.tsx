// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useUpdateReplyMutation, useDeleteReplyMutation } from "../api/communityEndpoints";
import { REPLY_MAX_LENGTH } from "../constants";
import type { CommunityReply } from "../types";

interface ReplyItemProps {
  reply: CommunityReply;
  commentId: string;
}

export function ReplyItem({ reply, commentId }: ReplyItemProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [updateReply, { isLoading: isUpdating }] = useUpdateReplyMutation();
  const [deleteReply, { isLoading: isDeleting }] = useDeleteReplyMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content ?? "");

  const authorName = reply.author?.username ?? "User";
  const isOwner = user?.id === reply.authorId;
  const dateStr = reply.createdAt
    ? new Date(reply.createdAt).toLocaleDateString()
    : "";

  const handleSave = useCallback(async () => {
    if (!editContent.trim()) return;
    try {
      await updateReply({ replyId: reply.id, content: editContent }).unwrap();
      setIsEditing(false);
      toast.success(t("replyUpdated", "Reply updated"));
    } catch {
      toast.error(t("failedToUpdateReply", "Failed to update reply"));
    }
  }, [updateReply, reply.id, editContent, t]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteReply({ replyId: reply.id, commentId }).unwrap();
      toast.success(t("replyDeleted", "Reply deleted"));
    } catch {
      toast.error(t("failedToDeleteReply", "Failed to delete reply"));
    }
  }, [deleteReply, reply.id, commentId, t]);

  return (
    <div className="flex items-start gap-3 ml-8 mt-3">
      <div className="w-7 h-7 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-[10px] font-semibold shrink-0">
        {authorName.charAt(0)?.toUpperCase() ?? "U"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-[#0D4D4D]">
            {authorName}
          </p>
          {dateStr && (
            <span className="text-[11px] text-[#0D4D4D]/40">
              {dateStr}
            </span>
          )}
          {isOwner && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-[#0D4D4D]/40 hover:text-[#0E808D] transition-colors"
              >
                {t("edit", "Edit")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[11px] text-[#0D4D4D]/40 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {t("delete", "Delete")}
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1.5">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              maxLength={REPLY_MAX_LENGTH}
              className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditContent(reply.content ?? ""); }}
                className="text-[11px] text-[#0D4D4D]/50 hover:text-[#0D4D4D] font-medium transition-colors"
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating || !editContent.trim()}
                className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors disabled:opacity-50"
              >
                {isUpdating ? t("saving", "Saving...") : t("save", "Save")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#0D4D4D]/70 mt-0.5">{reply.content}</p>
        )}
      </div>
    </div>
  );
}
