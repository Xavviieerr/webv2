"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowLeft, IconSend, IconLoader2, IconX, IconPhoto } from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { POST_CONTENT_MAX_LENGTH } from "../constants";
import { useCreatePost } from "../hooks/useCreatePost";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isSubmitting,
    isSuccess,
    errors,
    handleSubmit,
    reset,
    title,
    content,
    categoryId,
    tagIds,
    setTitle,
    setContent,
    setCategoryId,
    setTagIds,
    categories,
    tags,
    imagePreview,
    isUploading,
    handleImageSelect,
    removeImage,
  } = useCreatePost();

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({ title, content, categoryId, tagIds });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        <div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-lg mx-4 p-6">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
              <IconSend className="w-8 h-8 text-[#0E808D]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0D4D4D]">
              {t("postCreated", "Post Created")}
            </h3>
            <p className="text-sm text-[#0D4D4D]/60 mt-1 max-w-xs">
              {t("postCreatedMessage", "Your post has been created as a draft. You can publish it when ready.")}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              {t("backToCommunity", "Back to Community")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50"
            >
              <IconArrowLeft className="size-4" />
            </button>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
              {t("createNewPost", "Create New Post")}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#0D4D4D]/50 transition-colors hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D]"
          >
            <IconX className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          <div className="px-5 sm:px-6 pt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-[#0E808D] text-sm font-semibold shrink-0">
              {user?.username?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D4D4D]">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username ?? "User"}
              </p>
              <p className="text-[11px] text-[#0D4D4D]/40">
                {t("draft", "Draft")}
              </p>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label
              htmlFor="post-title"
              className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
            >
              {t("title", "Title")}
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder={t("titlePlaceholder", "Give your post a title")}
              className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.title ? (
                <p className="text-red-500 text-xs">{errors.title}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-[#0D4D4D]/40">
                {title.length}/200
              </span>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label
              htmlFor="post-content"
              className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
            >
              {t("content", "Content")}
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={POST_CONTENT_MAX_LENGTH}
              placeholder={t("contentPlaceholder", "Write your post...")}
              className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]"
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.content ? (
                <p className="text-red-500 text-xs">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-[#0D4D4D]/40">
                {content.length}/{POST_CONTENT_MAX_LENGTH}
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />

          {imagePreview && (
            <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
              <div className="relative inline-block rounded-lg overflow-hidden border border-[#0D4D4D]/15">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <IconLoader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label
              htmlFor="post-category"
              className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
            >
              {t("category", "Category")}
            </label>
            <select
              id="post-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
            >
              <option value="">{t("selectCategory", "Select category")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1.5">{errors.categoryId}</p>
            )}
          </div>

          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">
              {t("tags", "Tags")}
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setTagIds(tagIds.filter((id) => id !== tag.id));
                      } else {
                        setTagIds([...tagIds, tag.id]);
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-[#0E808D] bg-[#0E808D]/10 text-[#0E808D]"
                        : "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
            {errors.tagIds && (
              <p className="text-red-500 text-xs mt-1.5">{errors.tagIds}</p>
            )}
          </div>

          <div className="px-5 sm:px-6 py-3 flex items-center justify-between shrink-0" aria-live="polite">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg p-2 text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-50"
              title={t("addImage", "Add an image")}
            >
              <IconPhoto className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading || !title.trim() || !content.trim() || !categoryId || tagIds.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isUploading ? (
                <>
                  <IconLoader2 className="animate-spin w-4 h-4" />
                  <span>{isUploading ? t("uploading", "Uploading...") : t("creating", "Creating...")}</span>
                </>
              ) : (
                <>
                  <IconSend className="w-4 h-4" />
                  {t("post", "Post")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
