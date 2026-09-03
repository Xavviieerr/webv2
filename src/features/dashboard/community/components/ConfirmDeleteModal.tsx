"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useDeletePostMutation } from "../api/communityEndpoints";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmDeleteModal({ isOpen, postId, onClose, onSuccess }: ConfirmDeleteModalProps) {
  const { t } = useTranslation("common");
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleDelete = useCallback(async () => {
    try {
      await deletePost(postId).unwrap();
      toast.success(t("postDeleted", "Post deleted"));
      onSuccess();
    } catch {
      toast.error(t("failedToDeletePost", "Failed to delete post"));
    }
  }, [deletePost, postId, t, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-base font-semibold text-[#0D4D4D]">
          {t("deletePost", "Delete Post")}
        </h3>
        <p className="text-sm text-[#0D4D4D]/60 mt-2">
          {t("deletePostConfirm", "Are you sure you want to delete this post? This action cannot be undone.")}
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-2 text-sm font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50"
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? t("deleting", "Deleting...") : t("delete", "Delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
