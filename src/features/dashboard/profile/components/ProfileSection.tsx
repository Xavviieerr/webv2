"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileView } from "./ProfileView";
import { UnifiedProfileForm } from "./UnifiedProfileForm";
import { logoutHandler } from "@/features/auth";
import type { User as AppUser } from "@/types";
import type { ProfileEditMode } from "../types";

interface ProfileSectionProps {
	user: AppUser | null | undefined;
	showLogout?: boolean;
}

export function ProfileSection({
	user,
	showLogout = true,
}: ProfileSectionProps) {
	const [editMode, setEditMode] = useState<ProfileEditMode>(null);
	const router = useRouter();
	const { t } = useTranslation("common");

	if (!user) return null;

	const handleLogOut = () => {
		logoutHandler();
		router.push("/home");
	};

	return (
		<div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-7 flex-1 max-w-2xl mx-auto w-full">
			<div className="flex justify-center">
				<AvatarUpload user={user} />
			</div>

			<div className="w-full bg-[#F2FEFF] rounded-xl border border-[#0D4D4D]/10 shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-200">
				{editMode === "edit" ? (
					<UnifiedProfileForm user={user} onCancel={() => setEditMode(null)} />
				) : (
					<ProfileView
						user={user}
						onEditProfile={() => setEditMode("edit")}
					/>
				)}
			</div>

			{showLogout && (
				<button
					onClick={handleLogOut}
					className="w-full px-4 py-2.5 text-sm text-danger font-medium hover:bg-red-50 active:bg-red-100 transition-colors rounded-lg border border-red-100 hover:border-red-200"
				>
					{t("logout")}
				</button>
			)}
		</div>
	);
}

export default ProfileSection;
