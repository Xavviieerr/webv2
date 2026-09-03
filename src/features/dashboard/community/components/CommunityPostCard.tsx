"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconSend,
  IconPlayerStop,
  IconTrash,
  IconDotsVertical,
  IconPencil,
} from "@tabler/icons-react";
import {
  useLikePostMutation,
  useUnlikePostMutation,
  usePublishPostMutation,
  useUnpublishPostMutation,
  useDeletePostMutation,
} from "../api/communityEndpoints";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { formatRelativeTime } from "../utils";
import { renderMarkdown } from "../lib/format-text";
import type { CommunityPostListItem } from "../types";

interface CommunityPostCardProps {
  post: CommunityPostListItem;
  currentUserId?: string;
  onEdit?: (post: CommunityPostListItem) => void;
}

export function CommunityPostCard({ post, currentUserId, onEdit }: CommunityPostCardProps) {
  const { t } = useTranslation("common");
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [publishPost] = usePublishPostMutation();
  const [unpublishPost] = useUnpublishPostMutation();
  const [deletePost] = useDeletePostMutation();

  const authorName = post.author?.username ?? "User";
  const content = post.content ?? "";
  const contentExcerpt = content.length > 200
    ? content.slice(0, 200) + "..."
    : content;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const dateStr = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "";

  const isOwner = !!currentUserId && (currentUserId === post.authorId || currentUserId === post.author?.id);
  const hasLiked = !!currentUserId && Array.isArray(post.likedBy) && post.likedBy.some((u) => u.id === currentUserId);
  const isDraft = !post.publishedAt;

  const handleLikeToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handlePublish = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await publishPost(post.id).unwrap();
      toast.success(t("postPublished", "Post published"));
    } catch {
      toast.error(t("failedToPublish", "Failed to publish post"));
    }
    setShowActions(false);
  }, [publishPost, post.id, t]);

  const handleUnpublish = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await unpublishPost(post.id).unwrap();
      toast.success(t("postUnpublished", "Post unpublished"));
    } catch {
      toast.error(t("failedToUnpublish", "Failed to unpublish post"));
    }
    setShowActions(false);
  }, [unpublishPost, post.id, t]);

  const handleDeleteSuccess = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return (
    <>
      <Link
        href={`/dashboard/community/${post.id}`}
        className="block rounded-xl border border-[#02474F]/10 bg-[#D4E8EA]/70 px-5 sm:px-6 py-5 transition-all hover:shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          {post.author?.profilePictureUrl ? (
            <img
              src={post.author.profilePictureUrl}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#02474F]/10 flex items-center justify-center text-[#02474F] text-[15px] font-semibold shrink-0">
              {authorName.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#02474F] truncate">
              {authorName}
            </p>
            {dateStr && (
              <p className="text-[13px] text-[#02474F]/40">
                {dateStr}
                {isDraft && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-[#F5DEB3]/40 px-1.5 py-0.5 text-[10px] font-medium text-[#02474F]">
                    {t("draft", "Draft")}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.category && (
              <span className="inline-flex items-center rounded-full bg-[#F5DEB3]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#02474F]">
                {post.category.name}
              </span>
            )}
            {isOwner && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="rounded-lg p-1 text-[#02474F]/40 hover:text-[#02474F] hover:bg-[#02474F]/5 transition-colors"
                >
                  <IconDotsVertical className="w-4 h-4" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 z-10 bg-[#F2FEFF] rounded-lg border border-[#02474F]/10 shadow-lg py-1 min-w-[140px]">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowActions(false);
                          onEdit(post);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#02474F] hover:bg-[#D4E8EA]/50 transition-colors text-left"
                      >
                        <IconPencil className="w-3.5 h-3.5" />
                        {t("edit", "Edit")}
                      </button>
                    )}
                    {post.publishedAt ? (
                      <button
                        type="button"
                        onClick={handleUnpublish}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#02474F] hover:bg-[#D4E8EA]/50 transition-colors text-left"
                      >
                        <IconPlayerStop className="w-3.5 h-3.5" />
                        {t("unpublish", "Unpublish")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#02474F] hover:bg-[#D4E8EA]/50 transition-colors text-left"
                      >
                        <IconSend className="w-3.5 h-3.5" />
                        {t("publish", "Publish")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowActions(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                      {t("delete", "Delete")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {post.media && post.media.length > 0 && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={post.media[0].url}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="text-[14px] text-[#02474F]/65 line-clamp-2 mb-3">
          {renderMarkdown(contentExcerpt)}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-[#D4E8EA] px-2 py-0.5 text-[11px] font-medium text-[#02474F]/60"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 text-[13px] text-[#02474F]/45 border-t border-[#02474F]/5 pt-3 mt-1">
          <span className="inline-flex items-center gap-1.5">
            <IconEye className="w-[18px] h-[18px]" />
            {post.viewCount ?? 0}
          </span>
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`inline-flex items-center gap-1.5 transition-colors ${
              hasLiked ? "text-[#02474F]" : "text-[#02474F]/70 hover:text-[#F5DEB3]"
            }`}
          >
            {hasLiked ? (
              <IconHeartFilled className="w-[18px] h-[18px] text-[#F5DEB3]" />
            ) : (
              <IconHeart className="w-[18px] h-[18px]" />
            )}
            {post.likeCount ?? 0}
          </button>
          <span className="inline-flex items-center gap-1.5">
            <IconMessageCircle className="w-[18px] h-[18px]" />
            {t("comments", "Comments")}
          </span>
        </div>
      </Link>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        postId={post.id}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
