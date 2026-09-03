"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  IconHeart,
  IconHeartFilled,
  IconSend,
  IconPlayerStop,
  IconTrash,
  IconFlag,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import {
  useLikePostMutation,
  useUnlikePostMutation,
  usePublishPostMutation,
  useUnpublishPostMutation,
} from "../api/communityEndpoints";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { ReportPostModal } from "./ReportPostModal";
import type { CommunityPost } from "../types";

interface PostActionsProps {
  post: CommunityPost;
}

export function PostActions({ post }: PostActionsProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [publishPost] = usePublishPostMutation();
  const [unpublishPost] = useUnpublishPostMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isOwner = user?.id === post.authorId;
  const hasLiked = !!user?.id && Array.isArray(post.likedBy) && post.likedBy.some((u) => u.id === user.id);

  const handleLikeToggle = useCallback(async () => {
    try {
      if (hasLiked) {
        await unlikePost(post.id).unwrap();
      } else {
        await likePost(post.id).unwrap();
      }
    } catch {
      toast.error(t("failedToLike", "Failed to update like"));
    }
  }, [hasLiked, likePost, unlikePost, post.id, t]);

  const handlePublish = useCallback(async () => {
    try {
      await publishPost(post.id).unwrap();
      toast.success(t("postPublished", "Post published"));
    } catch {
      toast.error(t("failedToPublish", "Failed to publish post"));
    }
  }, [publishPost, post.id, t]);

  const handleUnpublish = useCallback(async () => {
    try {
      await unpublishPost(post.id).unwrap();
      toast.success(t("postUnpublished", "Post unpublished"));
    } catch {
      toast.error(t("failedToUnpublish", "Failed to unpublish post"));
    }
  }, [unpublishPost, post.id, t]);

  const handleDeleteSuccess = useCallback(() => {
    setShowDeleteModal(false);
    router.push("/dashboard/community");
  }, [router]);

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleLikeToggle}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-colors ${
            hasLiked
              ? "border-[#0E808D]/30 bg-[#0E808D]/10 text-[#02474F]"
              : "border-[#02474F]/15 bg-[#D4E8EA]/30 text-[#02474F] hover:bg-[#D4E8EA]/50"
          }`}
        >
          {hasLiked ? (
            <IconHeartFilled className="w-[18px] h-[18px] text-[#0E808D]" />
          ) : (
            <IconHeart className="w-[18px] h-[18px] text-[#02474F]" />
          )}
          {post.likeCount}
        </button>

        {isOwner && (
          <>
            {post.published ? (
              <button
                type="button"
                onClick={handleUnpublish}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#02474F]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-[13px] font-medium text-[#02474F] transition-colors hover:bg-[#D4E8EA]/50"
              >
                <IconPlayerStop className="w-4 h-4" />
                {t("unpublish", "Unpublish")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#02474F] px-3.5 py-2 text-[13px] font-medium text-[#F5DEB3] transition-colors hover:bg-[#02474F]/90"
              >
                <IconSend className="w-4 h-4" />
                {t("publish", "Publish")}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <IconTrash className="w-4 h-4" />
              {t("delete", "Delete")}
            </button>
          </>
        )}

        {!isOwner && (
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#02474F]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-[13px] font-medium text-[#02474F]/50 transition-colors hover:bg-[#D4E8EA]/50 hover:text-[#02474F]"
          >
            <IconFlag className="w-4 h-4" />
            {t("report", "Report")}
          </button>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        postId={post.id}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />

      <ReportPostModal
        isOpen={showReportModal}
        postId={post.id}
        onClose={() => setShowReportModal(false)}
      />
    </>
  );
}
