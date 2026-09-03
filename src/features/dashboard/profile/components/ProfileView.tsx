"use client";

import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { formatStatus } from "../utils";
import type { ProfileViewProps } from "../types";

const STATUS_BADGES: Record<string, string> = {
	active: "bg-emerald-100 text-emerald-700",
	suspended: "bg-red-100 text-red-700",
	pending: "bg-amber-100 text-amber-700",
	inactive: "bg-[#0D4D4D]/10 text-[#0D4D4D]/60",
};

const STATUS_DOT: Record<string, string> = {
	active: "bg-emerald-500",
	suspended: "bg-red-500",
	pending: "bg-amber-500",
	inactive: "bg-[#0D4D4D]/40",
};

export function ProfileView({ user, onEditProfile }: ProfileViewProps) {
	const { t, i18n } = useTranslation("common");

	const firstName = user?.firstName || "—";
	const lastName = user?.lastName || "—";
	const username = user?.username ? `@${user.username}` : "—";
	const email = user?.email ?? "—";
	const status = formatStatus(user?.status);
	const roleMap: Record<string, string> = {
		admin: t("roleAdmin"),
		user: t("roleUser"),
		super_admin: t("roleSuperAdmin"),
		super_user: t("roleSuperUser"),
	};
	const role = user?.role ? (roleMap[user.role] ?? user.role) : "—";
	const lastLogin = user?.lastLogin
		? new Date(user.lastLogin).toLocaleDateString(i18n.language, {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		: "—";

	const gender = user?.gender
		? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
		: "—";
	const dob = user?.DOB
		? new Date(user.DOB).toLocaleDateString(i18n.language, {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		: "—";
	const province = user?.province || "—";
	const town = user?.town || "—";

	const statusKey = user?.status?.toLowerCase() ?? "inactive";
	const badge = STATUS_BADGES[statusKey] ?? STATUS_BADGES.inactive;
	const dot = STATUS_DOT[statusKey] ?? STATUS_DOT.inactive;

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-[#0D4D4D]/70">
					{t("personalInformation")}
				</h3>
				<button
					type="button"
					onClick={onEditProfile}
					className="inline-flex items-center gap-1.5 text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5 active:bg-[#0E808D]/10 text-xs font-medium py-1.5 px-2.5 rounded-lg transition-colors"
				>
					<Pencil className="w-3.5 h-3.5" />
					{t("edit")}
				</button>
			</div>

			<div className="px-5 sm:px-6">
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">
						{t("firstName")}
					</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{firstName}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">
						{t("lastName")}
					</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{lastName}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">
						{t("username")}
					</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{username}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">{t("gender")}</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{gender}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">{t("dateOfBirth")}</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{dob}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[#0D4D4D]/10 hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">{t("province")}</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{province}</span>
				</div>
				<div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-[#0D4D4D]/[0.03] transition-colors">
					<span className="text-[#0D4D4D]/50 text-sm font-medium">{t("town")}</span>
					<span className="text-[#0D4D4D] font-medium text-sm">{town}</span>
				</div>
			</div>

			<div className="mx-5 sm:mx-6 border-t border-[#0D4D4D]/10" />

			<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-[#0D4D4D]/70">
					{t("account")}
				</h3>
			</div>

			<div className="px-5 sm:px-6 pb-5 sm:pb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
					<div className="flex flex-col gap-1.5 min-w-0">
						<span className="text-[#0D4D4D]/50 text-sm font-medium">
							{t("emailAddress")}
						</span>
						<span className="text-[#0D4D4D] font-medium text-sm break-all">
							{email}
						</span>
					</div>
					<div className="flex flex-col gap-1.5 min-w-0 items-end">
						<span className="text-[#0D4D4D]/50 text-sm font-medium text-right">
							{t("accountStatus")}
						</span>
						<span
							className={cn(
								"inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold",
								badge,
							)}
						>
							<span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
							{status}
						</span>
					</div>
					<div className="flex flex-col gap-1.5 min-w-0">
						<span className="text-[#0D4D4D]/50 text-sm font-medium">{t("role")}</span>
						<span className="text-[#0D4D4D] font-medium text-sm truncate">
							{role}
						</span>
					</div>
					<div className="flex flex-col gap-1.5 min-w-0 items-end">
						<span className="text-[#0D4D4D]/50 text-sm font-medium text-right">
							{t("lastLogin")}
						</span>
						<span className="text-[#0D4D4D] font-medium text-sm truncate text-right">
							{lastLogin}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
