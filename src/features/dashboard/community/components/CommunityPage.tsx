"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommunityFeed } from "./CommunityFeed";
import { UserPostsFeed } from "./UserPostsFeed";
import { ComposePost } from "./ComposePost";
import { EditPostModal } from "./EditPostModal";
import { CommunitySidebar } from "./CommunitySidebar";
import type { CommunityPostListItem } from "../types";

type Tab = "all" | "mine";

export function CommunityPage() {
  const { t } = useTranslation("common");
  const [editingPost, setEditingPost] = useState<CommunityPostListItem | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  return (
    <div className="min-h-0 lg:h-[calc(100vh-var(--top-banners-height,65px))] flex flex-col max-w-5xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6 lg:gap-8 p-4 sm:p-5 lg:p-6">
        {/* Left: Posts */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#F2FEFF] rounded-2xl border border-[#02474F]/10 shadow-lg overflow-hidden">
          <div className="px-5 sm:px-6 flex items-center gap-1 border-b border-[#02474F]/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2.5 text-xs font-semibold transition-colors rounded-t-lg ${
                activeTab === "all"
                  ? "text-[#02474F] border-b-2 border-[#F5DEB3]"
                  : "text-[#02474F]/50 hover:text-[#02474F]"
              }`}
            >
              {t("allPosts", "All Posts")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mine")}
              className={`px-3 py-2.5 text-xs font-semibold transition-colors rounded-t-lg ${
                activeTab === "mine"
                  ? "text-[#02474F] border-b-2 border-[#F5DEB3]"
                  : "text-[#02474F]/50 hover:text-[#02474F]"
              }`}
            >
              {t("myPosts", "My Posts")}
            </button>
          </div>

          {/* Compose box */}
          <div className="px-5 sm:px-6 py-4 border-b border-[#02474F]/10">
            <ComposePost />
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-y-auto min-h-0 px-5 sm:px-6 py-4 custom-scrollbar">
            {activeTab === "all" ? (
              <CommunityFeed onEditPost={setEditingPost} />
            ) : (
              <UserPostsFeed onEditPost={setEditingPost} />
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0">
          <CommunitySidebar />
        </div>
      </div>

      <EditPostModal
        isOpen={editingPost !== null}
        onClose={() => setEditingPost(null)}
        post={editingPost}
      />
    </div>
  );
}
