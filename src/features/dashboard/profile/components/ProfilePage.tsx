// ProfilePage.tsx (only className changes shown in context, full file below)
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/slice/changeLangSlice";
import { RootState } from "@/store/store";
import i18n from "@/lib/i18n";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { useGetMeQuery } from "@/features/auth";
import { logoutHandler } from "@/features/auth";
import ProfileSection from "./ProfileSection";
import type { User as AppUser } from "@/types";

export function ProfilePage() {
	const { t } = useTranslation("common");
	const isMobile = useIsMobile();
	const router = useRouter();

	const dispatch = useAppDispatch();
	const language = useAppSelector(
		(state: RootState) => state.language.language,
	);
	const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

	const reduxUser = useAppSelector((state) => state.auth?.user ?? null);
	const {
		data: profile,
		isLoading,
		error,
		refetch,
	} = useGetMeQuery();
	const user = (reduxUser && profile
		? { ...reduxUser, ...profile }
		: profile ?? reduxUser) as AppUser | null | undefined;

	const handleLanguageSelect = (lang: "en" | "urhobo") => {
		dispatch(setLanguage(lang));
		if (typeof i18n.changeLanguage === "function") {
			i18n.changeLanguage(lang);
		}
		setIsLanguageDropdownOpen(false);
	};

	const handleLogout = () => {
		logoutHandler();
		router.push("/signin");
	};

	const handleBack = () => {
		router.push("/dashboard");
	};

	return (
		<div
			className={cn(
				"w-full min-h-[calc(100vh-var(--top-banners-height,65px))] sm:min-h-0 flex flex-col",
				!isMobile &&
					"max-w-5xl mx-auto rounded-2xl overflow-hidden border border-ink/10 shadow-lg mt-4 sm:mt-6",
			)}
		>
			<div className="flex flex-col lg:flex-row min-h-[70vh] sm:min-h-[520px] w-full">
				<aside
					className={cn(
						"shrink-0 flex flex-col p-5 sm:p-6",
						"w-full lg:w-[260px] xl:w-[280px] rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none bg-surface-raised border-b lg:border-b-0 lg:border-r border-ink/10",
					)}
				>
					<button
						type="button"
						className="inline-flex items-center gap-2 mb-6 justify-start -mx-2 px-2 py-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors w-fit"
						onClick={handleBack}
					>
						<ChevronLeft className="w-5 h-5 shrink-0" />
						<span>{t("back")}</span>
					</button>

					<div className="mb-6 sm:mb-8">
						<h2 className="text-2xl font-semibold text-ink tracking-tight">
							{t("myProfile")}
						</h2>
						<p className="text-sm mt-1 text-ink-muted">
							{t("manageYourAccount")}
						</p>
					</div>

					<div className="mt-auto space-y-5 pt-8">
						<div className="relative">
							<button
								type="button"
								onClick={() =>
									setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
								}
								aria-expanded={isLanguageDropdownOpen}
								aria-haspopup="listbox"
								className="w-fit flex items-center justify-between gap-2 rounded-full border border-ink/20 py-2 px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
							>
								<span>{language === "en" ? "ENG" : "URH"}</span>
								<ChevronDown
									className={cn(
										"w-4 h-4 transition-transform",
										isLanguageDropdownOpen && "rotate-180",
									)}
								/>
							</button>
							{isLanguageDropdownOpen && (
								<div
									role="listbox"
									className="absolute bottom-full left-0 right-0 mb-2 border border-ink/15 rounded-lg shadow-lg overflow-hidden z-50 bg-surface-raised"
								>
									<button
										type="button"
										role="option"
										aria-selected={language === "urhobo"}
										onClick={() => handleLanguageSelect("urhobo")}
										className={cn(
											"w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all",
											language === "urhobo"
												? "bg-brand text-white"
												: "text-ink-muted hover:bg-ink/10",
										)}
									>
										<Image
											src="/images/urhobo.png"
											alt="Urhobo"
											width={14}
											height={14}
											className="object-contain"
										/>
										URH
									</button>
									<button
										type="button"
										role="option"
										aria-selected={language === "en"}
										onClick={() => handleLanguageSelect("en")}
										className={cn(
											"w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all",
											language === "en"
												? "bg-brand text-white"
												: "text-ink-muted hover:bg-ink/10",
										)}
									>
										<Image
											src="/uk-flag.png"
											alt="UK flag"
											width={14}
											height={14}
											className="object-contain rounded-sm"
										/>
										ENG
									</button>
								</div>
							)}
						</div>

						<button
							type="button"
							onClick={handleLogout}
							className="flex items-center gap-2 w-full text-sm font-medium text-danger rounded-lg px-3 py-2.5 -mx-1 transition-colors hover:bg-red-500/10 active:bg-red-500/15"
						>
							<LogOut className="w-5 h-5 shrink-0" />
							<span>{t("logout")}</span>
						</button>
					</div>
				</aside>

				<main className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none bg-surface">
					<div className="flex items-center gap-2 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-ink/10 shrink-0">
						<h1 className="text-lg sm:text-xl font-semibold truncate text-ink tracking-tight">
							{t("myProfile")}
						</h1>
					</div>

					<div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
						{isLoading ? (
							<div className="p-4 sm:p-6 space-y-4">
								{Array.from({ length: 4 }).map((_, i) => (
									<div
										key={i}
										className="h-16 rounded-xl bg-ink/10 animate-pulse"
									/>
								))}
							</div>
						) : error && !user ? (
							<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
								<p className="text-sm text-ink-muted">
									{t("failedToLoadProfile")}
								</p>
								<button
									onClick={() => refetch()}
									className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
								>
									{t("tryAgain")}
								</button>
							</div>
						) : (
							<ProfileSection user={user} showLogout={false} />
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default ProfilePage;
