"use client";

import { useTranslation } from "react-i18next";
import { useGetPostCommentsQuery } from "../api/communityEndpoints";
import { CommentItem } from "./CommentItem";
import { CommentComposer } from "./CommentComposer";

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { t } = useTranslation("common");
  const { data: comments = [], isLoading } = useGetPostCommentsQuery(postId);

  return (
    <div className="mt-6 pt-6 border-t border-[#0D4D4D]/10">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D] mb-4">
        {t("comments", "Comments")} ({comments.length})
      </h3>

      <div className="mb-6">
        <CommentComposer postId={postId} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
              <div className="flex-1">
                <div className="h-3 w-24 rounded mb-2 animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
                <div className="h-3 w-48 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-[#0D4D4D]/50 text-center py-6">
          {t("noCommentsYet", "No comments yet. Be the first to comment.")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
