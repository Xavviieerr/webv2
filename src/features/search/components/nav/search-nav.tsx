"use client";

import Image from "next/image";
import React, { useState, useMemo } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import ProfileModal from "@/components/ProfileModal";
import UsernameModal from "@/components/UsernameModal";
import PasswordModal from "@/components/PasswordModal";
import DeleteAccountModal from "@/components/DeleteModal";
import { useAppSelector } from "@/types/hooks";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { MainProfilePage } from "@/features/dashboard/profile";
import { LanguageSwitcher } from "@/features/shared";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DesktopProfile } from "./desktop-profile";

interface NavbarProps {
	searchQuery?: string;
	activeModal?: string | null;
	onOpenModal?: (modalName: string) => void;
	onCloseModal?: () => void;
	renderModalsExternally?: boolean;
}

export default function SearchNav({
	searchQuery = "",
	activeModal: externalActiveModal,
	onOpenModal: externalOpenModal,
	onCloseModal: externalCloseModal,
	renderModalsExternally = false,
}: NavbarProps) {
	const [internalActiveModal, setInternalActiveModal] = useState<string | null>(
		null,
	);
	const [isNewMobileMenuOpen, setIsNewMobileMenuOpen] = useState(false);

	const params = useParams();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const q = params?.slug ?? searchParams.get("q");

	const isSearchInfoPage = pathname.startsWith("/search/") || pathname.startsWith("/guonopedia/search/");

	const activeModal =
		externalActiveModal !== undefined
			? externalActiveModal
			: internalActiveModal;

	const { user } = useAppSelector((state) => state.auth);

	const initials = useMemo(() => {
		const displayName =
			[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
			user?.username ||
			user?.email ||
			"User";
		return displayName
			.split(" ")
			.map((part: string) => part[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	}, [user]);

	const { t } = useTranslation("common");

	const closeModal = () => {
		if (externalCloseModal) {
			externalCloseModal();
		} else {
			setInternalActiveModal(null);
		}
	};

	return (
		<nav
			className="flex w-full sticky top-0 min-h-[56px] sm:min-h-[64px]"
			style={{ zIndex: 50 }}
		>
			<div className="flex flex-col w-full px-3 sm:px-6 z-50 lg:px-8 py-2 sm:py-3 bg-backg border-b border-secondary-foreground-50 relative min-h-[56px] sm:min-h-[64px]">
				{/* Main row: left + center + right */}
				<div className="flex items-center justify-between gap-2 sm:gap-4 w-full min-h-[48px]">
					{/* Left - Dashboard (and mobile menu trigger when no user) */}
					<div className="flex items-center gap-2 shrink-0 min-w-0">
						{user && !searchQuery && !q ? (
							<Link
								href="/dashboard"
								className="flex items-center justify-center px-3 py-2.5 sm:px-4 rounded-lg text-white text-xs sm:text-sm md:text-base font-semibold hover:opacity-90 transition-all whitespace-nowrap bg-[#165e5b]"
								style={{ backgroundColor: "#165e5b" }}
							>
								<span className="hidden sm:inline">{t("dashboard")}</span>
								<span className="sm:hidden">{t("dashboard")}</span>
							</Link>
						) : (
							<Link href={`/`} className="flex cursor-pointer">
								<Image
									src="/guono-logo.svg"
									alt="Guọnọ logo"
									width={100}
									height={30}
									className="h-7 md:h-8 w-auto"
								/>
							</Link>
						)}
					</div>

					{/* Right - User / Login */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
						{!isSearchInfoPage && <LanguageSwitcher />}

						{user ? (
							<>
								<DesktopProfile
									user={user}
									initials={initials}
									onOpenProfileModal={() => setIsNewMobileMenuOpen(true)}
								/>

								<MainProfilePage
									variant="modal"
									content="profile"
									open={isNewMobileMenuOpen}
									onOpenChange={setIsNewMobileMenuOpen}
								/>

								<button
									onClick={(e) => {
										e.stopPropagation();
										setIsNewMobileMenuOpen(!isNewMobileMenuOpen);
									}}
									className="md:hidden flex items-center justify-center rounded-full hover:opacity-90 transition-all"
									aria-label="Toggle Profile Menu"
								>
									<Avatar
										size="lg"
										className="border-2 border-gray-300 cursor-pointer"
									>
										<AvatarImage
											src={user?.profilePictureUrl}
											alt={user?.username || "User"}
										/>
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
								</button>
							</>
						) : (
							<Link
								href="/signin"
								className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-2.5 rounded-lg text-white text-xs sm:text-sm md:text-base font-semibold hover:opacity-90 transition-all whitespace-nowrap"
								style={{ backgroundColor: "#165e5b" }}
							>
								{t("login")}
							</Link>
						)}
					</div>
				</div>

				{/* Modals */}
				{!renderModalsExternally && (
					<>
						{activeModal === "personalDetails" && (
							<ProfileModal closeModal={closeModal} />
						)}
						{activeModal === "username" && (
							<UsernameModal closeModal={closeModal} />
						)}
						{activeModal === "password" && (
							<PasswordModal closeModal={closeModal} />
						)}
						{activeModal === "delete" && (
							<DeleteAccountModal closeModal={closeModal} />
						)}
					</>
				)}
			</div>
		</nav>
	);
}
