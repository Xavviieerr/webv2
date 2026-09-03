// MainProfilePage.tsx
"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "@/features/dashboard/settings";
import { ProfileSection } from "./ProfileSection";
import { useAppSelector } from "@/types/hooks";
import { useGetMeQuery } from "@/features/auth";
import type { User as AppUser } from "@/types";

interface MainProfilePageProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: "modal" | "page";
	content?: "settings" | "profile";
}

export const MainProfilePage = ({
	open = false,
	onOpenChange,
	variant = "modal",
	content = "settings",
}: MainProfilePageProps) => {
	const { t } = useTranslation("common");

	const reduxUser = useAppSelector((state) => state.auth?.user ?? null);
	const { data: profile } = useGetMeQuery();
	const user = (
		reduxUser && profile ? { ...reduxUser, ...profile } : (profile ?? reduxUser)
	) as AppUser | null | undefined;

	if (variant === "page") {
		return <SettingsPage />;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="p-0 gap-0 py-5 overflow-y-auto border custom-scrollbar border-ink/10 shadow-2xl w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col sm:flex-row rounded-2xl bg-backg"
			>
				<DialogTitle className="sr-only">
					{content === "profile" ? t("myProfile") : t("settings")}
				</DialogTitle>
				{content === "profile" ? (
					<ProfileSection user={user} />
				) : (
					<SettingsPage />
				)}
			</DialogContent>
		</Dialog>
	);
};

export default MainProfilePage;
