"use client";

import { useTranslation } from "react-i18next";
import { IconRefresh } from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useCommunityPosts } from "../hooks/useCommunityPosts";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunityEmptyState } from "./CommunityEmptyState";
import { CommunitySkeleton } from "./CommunitySkeleton";

import type { CommunityPostListItem } from "../types";

interface CommunityFeedProps {
  onEditPost?: (post: CommunityPostListItem) => void;
}

export function CommunityFeed({ onEditPost }: CommunityFeedProps) {
  const { t } = useTranslation("common");
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const { posts, pagination, isLoading, isFetching, error, refetch, setPage } =
    useCommunityPosts();

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <p className="text-sm text-red-500">{t("failedToLoadPosts", "Failed to load posts.")}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90"
        >
          <IconRefresh className="w-3.5 h-3.5" />
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return <CommunityEmptyState />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#0D4D4D]/50">
          {pagination
            ? `${pagination.total} ${t("posts", "posts")}`
            : ""}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1.5 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50"
        >
          <IconRefresh className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        {posts.map((post) => (
          <CommunityPostCard key={post.id} post={post} currentUserId={currentUserId} onEdit={onEditPost} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0D4D4D]/10">
          <p className="text-xs text-[#0D4D4D]/50">
            {t("pageXofY", { page: pagination.page, total: pagination.totalPages })}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={!pagination.hasPrev || isFetching}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("previous")}
            </button>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={!pagination.hasNext || isFetching}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
