"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IconRefresh } from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useUserPosts } from "../hooks/useUserPosts";
import { useGetCommunityPostsQuery } from "../api/communityEndpoints";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunityEmptyState } from "./CommunityEmptyState";
import { CommunitySkeleton } from "./CommunitySkeleton";
import type { CommunityPostListItem } from "../types";

interface UserPostsFeedProps {
  onEditPost?: (post: CommunityPostListItem) => void;
}

export function UserPostsFeed({ onEditPost }: UserPostsFeedProps) {
  const { t } = useTranslation("common");
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const { posts, pagination, isLoading, isFetching, error, refetch, setPage } =
    useUserPosts();

  const { data: communityData } = useGetCommunityPostsQuery({ page: 1, limit: 100 });

  const enrichmentMap = useMemo(() => {
    const map = new Map<string, {
      likedBy?: CommunityPostListItem["likedBy"];
      media?: CommunityPostListItem["media"];
      author?: CommunityPostListItem["author"];
    }>();
    communityData?.posts?.forEach((p) => {
      map.set(p.id, {
        likedBy: p.likedBy,
        media: p.media,
        author: p.author,
      });
    });
    return map;
  }, [communityData]);

  const enrichedPosts = useMemo(() => {
    return posts.map((post) => {
      const enrichment = enrichmentMap.get(post.id);
      if (!enrichment) return post;
      return {
        ...post,
        likedBy: post.likedBy?.length ? post.likedBy : enrichment.likedBy,
        media: post.media?.length ? post.media : enrichment.media,
        author: post.author ?? enrichment.author,
      };
    });
  }, [posts, enrichmentMap]);

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
        {enrichedPosts.map((post) => (
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
