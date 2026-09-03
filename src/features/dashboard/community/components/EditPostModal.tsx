"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  IconArrowLeft,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { POST_CONTENT_MAX_LENGTH } from "../constants";
import { useUpdatePostMutation, useGetCategoriesQuery, useGetTagsQuery } from "../api/communityEndpoints";
import type { CommunityPostListItem } from "../types";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPostListItem | null;
}

export function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: tags = [] } = useGetTagsQuery();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (post && isOpen) {
      setTitle(post.title ?? "");
      setContent(post.content ?? "");
      setCategoryId(post.category?.id ?? "");
      setTagIds(post.tags?.map((tag) => tag.id) ?? []);
    }
  }, [post, isOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!post || !title.trim() || !content.trim() || !categoryId || tagIds.length === 0) return;

      const seoTitle = title.slice(0, 60);
      const seoDescription = content.slice(0, 160);

      try {
        await updatePost({
          id: post.id,
          body: {
            title: title.trim(),
            content: content.trim(),
            seoTitle,
            seoDescription,
            categoryId,
            tagIds,
          },
        }).unwrap();
        toast.success(t("postUpdated", "Post updated"));
        onClose();
      } catch (err: unknown) {
        const apiError = err as { data?: { message?: string }; message?: string };
        toast.error(apiError?.data?.message || apiError?.message || "Failed to update post");
      }
    },
    [post, title, content, categoryId, tagIds, updatePost, onClose, t],
  );

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10 shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50">
              <IconArrowLeft className="size-4" />
            </button>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">{t("editPost", "Edit Post")}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[#0D4D4D]/50 transition-colors hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D]">
            <IconX className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          <div className="px-5 sm:px-6 pt-4 flex items-center gap-3">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-sm font-semibold shrink-0">
                {user?.username?.charAt(0).toUpperCase() ?? "U"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[#0D4D4D]">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username ?? "User"}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label htmlFor="edit-post-title" className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">{t("title", "Title")}</label>
            <input id="edit-post-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
              placeholder={t("titlePlaceholder", "Give your post a title")}
              className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors" />
            <div className="flex items-center justify-end mt-1.5">
              <span className="text-xs text-[#0D4D4D]/40">{title.length}/200</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label htmlFor="edit-post-content" className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">{t("content", "Content")}</label>
            <textarea id="edit-post-content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} maxLength={POST_CONTENT_MAX_LENGTH}
              placeholder={t("contentPlaceholder", "Write your post...")}
              className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]" />
            <div className="flex items-center justify-end mt-1.5">
              <span className="text-xs text-[#0D4D4D]/40">{content.length}/{POST_CONTENT_MAX_LENGTH}</span>
            </div>
          </div>

          {/* Category */}
          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label htmlFor="edit-post-category" className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">{t("category", "Category")}</label>
            <select id="edit-post-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors">
              <option value="">{t("selectCategory", "Select category")}</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>

          {/* Tags */}
          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">{t("tags", "Tags")}</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = tagIds.includes(tag.id);
                return (
                  <button key={tag.id} type="button" onClick={() => { if (isSelected) { setTagIds(tagIds.filter((id) => id !== tag.id)); } else { setTagIds([...tagIds, tag.id]); } }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${isSelected ? "border-[#0E808D] bg-[#0E808D]/10 text-[#0E808D]" : "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"}`}>
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="px-5 sm:px-6 py-4 flex items-center justify-end shrink-0" aria-live="polite">
            <button type="submit" disabled={isLoading || !title.trim() || !content.trim() || !categoryId || tagIds.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <><IconLoader2 className="animate-spin w-4 h-4" /><span>{t("saving", "Saving...")}</span></>
              ) : (
                <span>{t("saveChanges", "Save Changes")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
