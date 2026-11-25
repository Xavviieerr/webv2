"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconArrowRight,
	IconBook2,
	IconSparkles,
} from "@tabler/icons-react";
import { useContributorAccess } from "../hooks/useContributorAccess";

/**
 * Dashboard entry point for the contributor program. Contributors who already
 * applied go straight to their hub; everyone else is invited to apply.
 */
export function ContributorDashboardCard() {
	const { t } = useTranslation("common");
	const { hasApplication, isLoading, applyHref, hubHref } =
		useContributorAccess();

	if (isLoading) {
		return (
			<div className="min-h-[164px] w-full animate-pulse rounded-2xl border border-[#D4E8EA] bg-[#D4E8EA]/60" />
		);
	}

	const href = hasApplication ? hubHref : applyHref;
	const title = hasApplication
		? t("contributorDashboardHubTitle")
		: t("contributorDashboardApplyTitle");
	const description = hasApplication
		? t("contributorDashboardHubDescription")
		: t("contributorDashboardApplyDescription");
	const cta = hasApplication
		? t("contributorDashboardHubCta")
		: t("contributorDashboardApplyCta");

	return (
		<Link
			href={href}
			className="group flex h-full flex-col gap-3 rounded-2xl border border-[#D4E8EA] bg-[#F2FEFF] p-5 transition-all hover:-translate-y-0.5 hover:border-[#41A3AD] hover:shadow-md"
		>
			<div className="flex items-center justify-between gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#02474F] text-white">
					{hasApplication ? (
						<IconBook2 className="h-5 w-5" />
					) : (
						<IconSparkles className="h-5 w-5" />
					)}
				</span>
				<span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#02474F]">
					{t("contributorCardBadge")}
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<h2 className="break-words text-base font-semibold text-[#02474F] [overflow-wrap:anywhere]">
					{title}
				</h2>
				<p className="break-words text-sm leading-relaxed text-[#1A4349]/80 [overflow-wrap:anywhere]">
					{description}
				</p>
			</div>

			<span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#02474F]">
				{cta}
				<IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
			</span>
		</Link>
	);
}
