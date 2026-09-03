"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	IconPhoto,
	IconBold,
	IconItalic,
	IconCode,
	IconList,
	IconSend,
	IconLoader2,
	IconEye,
	IconPencil,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useCreatePost } from "../hooks/useCreatePost";
import { POST_CONTENT_MAX_LENGTH } from "../constants";
import { insertBold, insertItalic, insertCode, insertList, renderMarkdown } from "../lib/format-text";
import { EmojiPicker } from "./compose/EmojiPicker";
import { StatusDropdown } from "./compose/StatusDropdown";
import { ImagePreview } from "./compose/ImagePreview";

export function ComposePost() {
	const { t } = useTranslation("common");
	const user = useAppSelector((state) => state.auth.user);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const {
		isSubmitting,
		content,
		setContent,
		imagePreview,
		isUploading,
		handleImageSelect,
		removeImage,
		handleSubmit,
	} = useCreatePost();

	const [status, setStatus] = useState<"published" | "draft">("published");
	const [isPreview, setIsPreview] = useState(false);

	const formatOpts = {
		content,
		textarea: textareaRef.current!,
		setContent,
	};

	const handleEmojiInsert = useCallback(
		(emoji: string) => {
			const el = textareaRef.current;
			if (!el) return;
			const start = el.selectionStart;
			const newText = content.slice(0, start) + emoji + content.slice(start);
			setContent(newText);
			el.focus();
			requestAnimationFrame(() => {
				el.setSelectionRange(start + emoji.length, start + emoji.length);
			});
		},
		[content, setContent],
	);

	const autoGrow = useCallback(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
	}, []);

	const handlePreviewToggle = useCallback(() => {
		setIsPreview((prev) => {
			if (prev) {
				requestAnimationFrame(() => {
					textareaRef.current?.focus();
					autoGrow();
				});
			}
			return !prev;
		});
	}, [autoGrow]);

	const onSubmit = async () => {
		const ok = await handleSubmit({ content, status });
		if (ok) {
			setStatus("published");
			setIsPreview(false);
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		}
	};

	const charCount = content.length;
	const isOverLimit = charCount > POST_CONTENT_MAX_LENGTH;
	const isEmpty = !content.trim();

	return (
		<div className="flex gap-3">
			<div className="w-10 h-10 rounded-full bg-[#02474F]/10 flex items-center justify-center text-[#02474F] text-sm font-semibold shrink-0 overflow-hidden">
				{user?.profilePictureUrl ? (
					<img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
				) : (
					user?.username?.charAt(0).toUpperCase() ?? "U"
				)}
			</div>

			<div className="flex-1 min-w-0">
				{isPreview ? (
					<div className="min-h-[40px] text-sm text-[#02474F] leading-relaxed py-1">
						{content.trim() ? (
							renderMarkdown(content)
						) : (
							<span className="text-[#02474F]/30 italic">
								{t("nothingToPreview", "Nothing to preview")}
							</span>
						)}
					</div>
				) : (
					<textarea
						ref={textareaRef}
						value={content}
						onChange={(e) => {
							setContent(e.target.value);
							autoGrow();
						}}
						placeholder={t("whatsOnYourMind", "What's on your mind?")}
						rows={2}
						className="w-full resize-none bg-transparent text-sm text-[#02474F] placeholder:text-[#02474F]/30 focus:outline-none leading-relaxed"
					/>
				)}

				{imagePreview && (
					<ImagePreview
						preview={imagePreview}
						isUploading={isUploading}
						onRemove={removeImage}
					/>
				)}

				<div className="flex items-center justify-between pt-2 border-t border-[#02474F]/5">
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploading}
							className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-50"
							title={t("addImage", "Add image")}
						>
							<IconPhoto className="w-[18px] h-[18px]" />
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) handleImageSelect(f);
							}}
							className="hidden"
						/>

						<button
							type="button"
							onClick={() => insertBold(formatOpts)}
							disabled={isPreview}
							className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							title={t("bold", "Bold")}
						>
							<IconBold className="w-[18px] h-[18px]" />
						</button>
						<button
							type="button"
							onClick={() => insertItalic(formatOpts)}
							disabled={isPreview}
							className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							title={t("italic", "Italic")}
						>
							<IconItalic className="w-[18px] h-[18px]" />
						</button>
						<button
							type="button"
							onClick={() => insertCode(formatOpts)}
							disabled={isPreview}
							className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							title={t("code", "Code")}
						>
							<IconCode className="w-[18px] h-[18px]" />
						</button>
						<button
							type="button"
							onClick={() => insertList(formatOpts)}
							disabled={isPreview}
							className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
							title={t("list", "List")}
						>
							<IconList className="w-[18px] h-[18px]" />
						</button>

						<EmojiPicker onSelect={handleEmojiInsert} />

						<div className="w-px h-4 bg-[#02474F]/10 mx-0.5" />

						<button
							type="button"
							onClick={handlePreviewToggle}
							className={`p-1.5 rounded-lg transition-colors ${
								isPreview
									? "text-[#0E808D] bg-[#0E808D]/10"
									: "text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5"
							}`}
							title={isPreview ? t("edit", "Edit") : t("preview", "Preview")}
						>
							{isPreview ? (
								<IconPencil className="w-[18px] h-[18px]" />
							) : (
								<IconEye className="w-[18px] h-[18px]" />
							)}
						</button>
					</div>

					<div className="flex items-center gap-2">
						<StatusDropdown value={status} onChange={setStatus} />

						<span
							className={`text-[11px] ${isOverLimit ? "text-red-500" : "text-[#02474F]/40"}`}
						>
							{charCount}/{POST_CONTENT_MAX_LENGTH}
						</span>

						<button
							type="button"
							onClick={onSubmit}
							disabled={isSubmitting || isUploading || isEmpty || isOverLimit}
							className="p-1.5 rounded-lg bg-[#0E808D] text-white hover:bg-[#0E808D]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{isSubmitting || isUploading ? (
								<IconLoader2 className="w-4 h-4 animate-spin" />
							) : (
								<IconSend className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
