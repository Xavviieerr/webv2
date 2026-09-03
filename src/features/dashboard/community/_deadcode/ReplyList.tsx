// @ts-nocheck
"use client";

import { ReplyItem } from "./ReplyItem";
import { ReplyComposer } from "./ReplyComposer";
import type { CommunityReply } from "../types";

interface ReplyListProps {
  postId: string;
  commentId: string;
  replies: CommunityReply[];
  isLoading: boolean;
  showReplies: boolean;
  showReplyComposer: boolean;
  onCloseReply: () => void;
}

export function ReplyList({
  postId,
  commentId,
  replies,
  isLoading,
  showReplies,
  showReplyComposer,
  onCloseReply,
}: ReplyListProps) {
  if (!showReplies && !showReplyComposer) return null;

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="flex flex-col gap-2 ml-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg animate-pulse"
              style={{ backgroundColor: "#8AA5A81A" }}
            />
          ))}
        </div>
      ) : (
        replies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} commentId={commentId} />
        ))
      )}

      {showReplyComposer && (
        <ReplyComposer
          postId={postId}
          commentId={commentId}
          onClose={onCloseReply}
        />
      )}
    </div>
  );
}
