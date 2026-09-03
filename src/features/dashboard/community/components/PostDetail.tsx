"use client";

import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { IconArrowLeft, IconEye, IconHeart } from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useGetCommunityPostQuery, useGetCommunityPostsQuery } from "../api/communityEndpoints";
import { formatRelativeTime } from "../utils";
import { renderMarkdown } from "../lib/format-text";
import { PostActions } from "./PostActions";
import { CommentsSection } from "./CommentsSection";

export function PostDetail() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const user = useAppSelector((state) => state.auth.user);

  const postId = (params?.id as string) ?? "";

  const { data: post, isLoading, error } = useGetCommunityPostQuery(postId, {
    skip: !postId,
  });

  const { data: listData } = useGetCommunityPostsQuery(
    { page: 1, limit: 100 },
    { skip: !postId || !!post?.content }
  );

  const listPost = listData?.posts?.find((p) => p.id === postId);
  const displayPost = post?.content
    ? post
    : listPost
      ? { ...post, ...listPost } as typeof post
      : post;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-lg mt-4 sm:mt-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-3/4 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <p className="text-sm text-red-500">{t("failedToLoadPost", "Failed to load post.")}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90"
        >
          {t("goBack", "Go Back")}
        </button>
      </div>
    );
  }

  const authorName = displayPost?.author?.username ?? "User";
  const isOwner = user?.id === displayPost?.authorId;
  const categoryName = displayPost?.category?.name;
  const tags = Array.isArray(displayPost?.tags) ? displayPost!.tags : [];
  const dateStr = displayPost?.publishedAt
    ? formatRelativeTime(displayPost.publishedAt)
    : displayPost?.createdAt
      ? formatRelativeTime(displayPost.createdAt)
      : "";

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full bg-[#F2FEFF] rounded-2xl border border-[#02474F]/10 shadow-lg mt-4 sm:mt-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#02474F]/50 hover:text-[#02474F] transition-colors self-start"
      >
        <IconArrowLeft className="w-3.5 h-3.5" />
        {t("backToCommunity", "Back to Community")}
      </button>

      <div className="flex items-center gap-3">
        {displayPost?.author?.profilePictureUrl ? (
          <img
            src={displayPost.author.profilePictureUrl}
            alt={authorName}
            className="w-11 h-11 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#02474F]/10 flex items-center justify-center text-[#02474F] text-[15px] font-semibold shrink-0">
            {authorName.charAt(0)?.toUpperCase() ?? "U"}
          </div>
        )}
        <div>
          <p className="text-[15px] font-semibold text-[#02474F]">
            {authorName}
          </p>
          {dateStr && (
            <p className="text-[13px] text-[#02474F]/40">
              {dateStr}
              {isOwner && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#F5DEB3]/30 px-2 py-0.5 text-[11px] font-medium text-[#02474F]">
                  {displayPost?.published ? t("published", "Published") : t("draft", "Draft")}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div>
        {categoryName && (
          <span className="inline-flex items-center rounded-full bg-[#F5DEB3]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#02474F]">
            {categoryName}
          </span>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
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
      </div>

      {displayPost?.media && displayPost.media.length > 0 && (
        <div className="grid gap-2">
          {displayPost.media.map((m) => (
            <img
              key={m.id}
              src={m.url}
              alt={displayPost.title}
              className="w-full rounded-lg object-cover max-h-[360px]"
            />
          ))}
        </div>
      )}

      <div className="text-[15px] sm:text-base text-[#02474F]/70 leading-[1.7]">
        {renderMarkdown(displayPost?.content ?? "")}
      </div>

      <div className="flex items-center gap-6 text-[13px] text-[#02474F]/45 border-t border-[#02474F]/5 pt-4">
        <span className="inline-flex items-center gap-1.5">
          <IconEye className="w-[18px] h-[18px]" />
          {displayPost?.viewCount ?? 0} {t("views", "views")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconHeart className="w-[18px] h-[18px] text-[#02474F]" />
          {displayPost?.likeCount ?? 0} {t("likes", "likes")}
        </span>
      </div>

      <PostActions post={displayPost!} />

      <CommentsSection postId={displayPost?.id ?? postId} />
    </div>
  );
}
