"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useContributorAccess } from "../hooks/useContributorAccess";
import { buildScopeStatusMap } from "../utils/scopes";
import { ScopeGrid } from "./ScopeGrid";
import { ContributorSteps } from "./ContributorSteps";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";

export function ContributorHub() {
	const { t } = useTranslation("common");
	const {
		user,
		records,
		hasApplication,
		isLoading,
		isError,
		refetch,
	} = useContributorAccess();

	const statusMap = buildScopeStatusMap(records);
	const approvedCount = records.filter(
		(record) => record.status === "approved",
	).length;
	const pendingCount = records.filter(
		(record) => record.status === "pending",
	).length;
	const totalSubmissions = records.reduce(
		(sum, record) => sum + (record.submissionCount ?? 0),
		0,
	);

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<Link
				href="/guonopedia"
				className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
			>
				<IconArrowLeft className="h-4 w-4" />
				{t("backToGuonopedia")}
			</Link>

			<section className="relative overflow-hidden rounded-3xl bg-[#D4E8EA] p-6 sm:p-10">
				<div className="relative z-10 flex max-w-2xl flex-col gap-4">
					<span className="w-fit rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0D4D4D]">
						{t("contributeAndGrow")}
					</span>
					<h1 className="text-3xl font-semibold leading-tight text-[#0D4D4D] sm:text-4xl">
						{t("contributorHubTitle")}
					</h1>
					<p className="text-sm leading-relaxed text-gray-700 sm:text-base">
						{t("contributorHubDescription")}
					</p>
				</div>
				<div
					aria-hidden
					className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/40"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#0D4D4D]/10"
				/>
			</section>

			{isLoading && (
				<div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
					<IconLoader2 className="h-5 w-5 animate-spin" />
					{t("loading")}
				</div>
			)}

			{!isLoading && isError && (
				<div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
					<p>{t("somethingWentWrong")}</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-lg bg-[#0D4D4D] px-4 py-2 text-xs font-semibold text-white"
					>
						{t("tryAgain")}
					</button>
				</div>
			)}

			{!isLoading && !isError && hasApplication && (
				<section
					id="application-status"
					className="flex scroll-mt-24 flex-col gap-5"
				>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<SummaryTile
							label={t("approvedApplicationsLabel")}
							value={approvedCount}
							description={t("approvedApplicationsDescription")}
						/>
						<SummaryTile
							label={t("pendingApplicationsLabel")}
							value={pendingCount}
							description={t("pendingApplicationsDescription")}
						/>
						<SummaryTile
							label={t("submissionsLabel")}
							value={totalSubmissions}
							description={t("submissionsDescription")}
						/>
					</div>

					<div className="mt-2 border-t border-[#0D4D4D]/10" />

					<h2 className="text-xl font-semibold text-[#0D4D4D]">
						{t("scopes")}
					</h2>

					<ScopeGrid statusMap={statusMap} isAuthenticated={Boolean(user)} />
				</section>
			)}

			{!isLoading && !isError && !hasApplication && (
				<ScopeGrid statusMap={statusMap} isAuthenticated={Boolean(user)} />
			)}

			{!isLoading && !isError && !hasApplication && <ContributorSteps />}
		</main>
	);
}

function SummaryTile({
	label,
	value,
	description,
}: {
	label: string;
	value: number;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-[#0D4D4D]/10 bg-white px-5 py-4">
			<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
				{label}
			</p>
			<p className="mt-2 text-2xl font-semibold text-[#0D4D4D]">{value}</p>
			<p className="mt-1 text-xs leading-relaxed text-gray-500">
				{description}
			</p>
		</div>
	);
}
