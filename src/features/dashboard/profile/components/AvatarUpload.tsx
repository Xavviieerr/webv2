// AvatarUpload.tsx
"use client";

import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import { getInitials } from "../utils";
import type { AvatarUploadProps } from "../types";

export function AvatarUpload({ user }: AvatarUploadProps) {
	const { t } = useTranslation("common");
	const { fileInputRef, isUpdating, handleFileChange, triggerFileInput } =
		useAvatarUpload();

	const initials = getInitials(user?.firstName, user?.lastName);

	return (
		<div className="flex flex-col items-center gap-3">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="sr-only"
				aria-label={t("editProfilePicture")}
				onChange={handleFileChange}
				disabled={isUpdating}
			/>
			<div className="relative">
				<Avatar className="size-24 sm:size-28 rounded-full border-4 border-white ring-1 ring-ink/10 shadow-md overflow-hidden">
					<AvatarImage
						src={user?.profilePictureUrl}
						alt={t("profilePicture")}
					/>
					<AvatarFallback className="bg-surface-raised text-ink text-2xl font-semibold">
						{initials}
					</AvatarFallback>
				</Avatar>
				<button
					type="button"
					onClick={triggerFileInput}
					disabled={isUpdating}
					className="absolute -right-1 -bottom-1 flex items-center justify-center w-9 h-9 rounded-full bg-brand shadow-lg ring-2 ring-white transition-all hover:bg-brand/90 hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
					aria-label={t("editProfilePicture")}
				>
					{isUpdating ? (
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					) : (
						<Camera className="w-4 h-4 text-white" />
					)}
				</button>
			</div>
		</div>
	);
}
