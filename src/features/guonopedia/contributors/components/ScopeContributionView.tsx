"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconArrowLeft,
	IconArrowRight,
	IconLoader2,
	IconLock,
	IconTools,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useGetContributorScopesQuery } from "../api/contributorEndpoints";
import {
	getScopeDefinition,
	isContributorScope,
} from "../constants/scopes";
import { buildScopeStatusMap } from "../utils/scopes";
import type { ContributorScope, ContributorScopeRecord } from "../types";
import { StatusBadge } from "./StatusBadge";

const EMPTY_RECORDS: ContributorScopeRecord[] = [];

interface ScopeContributionViewProps {
	scope: string;
}

export function ScopeContributionView({ scope }: ScopeContributionViewProps) {
	const { t } = useTranslation("common");
	const user = useAppSelector((state) => state.auth.user);

	const { data, isLoading } = useGetContributorScopesQuery(
		user?.id ?? "",
		{ skip: !user?.id },
	);

	if (!isContributorScope(scope)) {
		return (
			<main className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-4 py-16">
				<h1 className="text-2xl font-semibold text-[#0D4D4D]">
					{t("notFound")}
				</h1>
				<Link
					href="/guonopedia/contribute"
					className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D4D4D] underline underline-offset-4"
				>
					{t("backToContributorHub")}
				</Link>
			</main>
		);
	}

	const definition = getScopeDefinition(scope);
	const Icon = definition.icon;
	const statusMap = buildScopeStatusMap(data ?? EMPTY_RECORDS);
	const record = statusMap[scope];
	const applyHref = user
		? `/guonopedia/contribute/apply?scope=${scope}`
		: `/signin?next=${encodeURIComponent(
				`/guonopedia/contribute/apply?scope=${scope}`,
			)}`;

	return (
		<main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<Link
				href="/guonopedia/contribute"
				className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
			>
				<IconArrowLeft className="h-4 w-4" />
				{t("backToContributorHub")}
			</Link>

			<header className="flex flex-col gap-4 rounded-3xl bg-[#D4E8EA] p-6 sm:p-8">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<span
							className="flex h-12 w-12 items-center justify-center rounded-2xl"
							style={{ backgroundColor: definition.color }}
						>
							<Icon className="h-6 w-6 text-white" />
						</span>
						<div>
							<h1 className="text-2xl font-semibold text-[#0D4D4D] sm:text-3xl">
								{t(definition.labelKey)}
							</h1>
							<p className="text-sm text-gray-700">
								{t(definition.descriptionKey)}
							</p>
						</div>
					</div>
					<StatusBadge status={record?.status} />
				</div>
			</header>

			{isLoading && (
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<IconLoader2 className="h-5 w-5 animate-spin" />
					{t("loading")}
				</div>
			)}

			{!isLoading && (
				<ScopeStatePanel
					scope={scope}
					record={record}
					applyHref={applyHref}
					isAuthenticated={Boolean(user)}
				/>
			)}
		</main>
	);
}

interface ScopeStatePanelProps {
	scope: ContributorScope;
	record?: ContributorScopeRecord;
	applyHref: string;
	isAuthenticated: boolean;
}

function ScopeStatePanel({
	scope,
	record,
	applyHref,
	isAuthenticated,
}: ScopeStatePanelProps) {
	const { t } = useTranslation("common");
	const definition = getScopeDefinition(scope);
	const status = record?.status;

	if (!isAuthenticated) {
		return (
			<Panel
				icon={<IconLock className="h-5 w-5" />}
				title={t("signInToApply")}
				description={t("scopeNotAppliedDescription")}
				actionHref={applyHref}
				actionLabel={t("login")}
			/>
		);
	}

	if (!record) {
		return (
			<Panel
				icon={<IconTools className="h-5 w-5" />}
				title={t("statusNotApplied")}
				description={t("scopeNotAppliedDescription")}
				actionHref={applyHref}
				actionLabel={t("applyForThisScope")}
			/>
		);
	}

	if (status === "pending") {
		return (
			<Panel
				icon={<IconLoader2 className="h-5 w-5" />}
				title={t("statusPending")}
				description={t("scopePendingDescription")}
			/>
		);
	}

	if (status === "rejected") {
		return (
			<Panel
				icon={<IconLock className="h-5 w-5" />}
				title={t("statusRejected")}
				description={t("scopeRejectedDescription")}
				actionHref={applyHref}
				actionLabel={t("applyForThisScope")}
			/>
		);
	}

	if (status === "suspended") {
		return (
			<Panel
				icon={<IconLock className="h-5 w-5" />}
				title={t("statusSuspended")}
				description={t("scopeSuspendedDescription")}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-col items-start gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6">
				<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D4D4D]">
					<IconTools className="h-5 w-5" />
				</span>
				<p className="max-w-xl text-sm leading-relaxed text-gray-600">
					{t("scopeApprovedDescription")}
				</p>
				{definition.available && definition.workspaceHref && (
					<Link
						href={definition.workspaceHref}
						className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("openWorkspace")}
						<IconArrowRight className="h-4 w-4" />
					</Link>
				)}
			</section>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<StatTile
					label={t("submissionsLabel")}
					value={record.submissionCount ?? 0}
				/>
				<StatTile
					label={t("statusApproved")}
					value={record.approvedCount ?? 0}
				/>
			</div>

			{!definition.available && (
				<div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
					<h3 className="text-sm font-semibold text-amber-900">
						{t("scopeComingSoonTitle")}
					</h3>
					<p className="mt-1 text-sm text-amber-800">
						{t("scopeComingSoonDescription")}
					</p>
				</div>
			)}
		</div>
	);
}

function Panel({
	icon,
	title,
	description,
	actionHref,
	actionLabel,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	actionHref?: string;
	actionLabel?: string;
}) {
	return (
		<section className="flex flex-col items-start gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6">
			<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D4D4D]">
				{icon}
			</span>
			<h2 className="text-lg font-semibold text-[#0D4D4D]">{title}</h2>
			<p className="max-w-xl text-sm leading-relaxed text-gray-600">
				{description}
			</p>
			{actionHref && actionLabel && (
				<Link
					href={actionHref}
					className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					{actionLabel}
					<IconArrowRight className="h-4 w-4" />
				</Link>
			)}
		</section>
	);
}

function StatTile({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] px-5 py-4">
			<p className="text-2xl font-semibold text-[#0D4D4D]">{value}</p>
			<p className="text-xs font-medium uppercase tracking-wide text-gray-500">
				{label}
			</p>
		</div>
	);
}
