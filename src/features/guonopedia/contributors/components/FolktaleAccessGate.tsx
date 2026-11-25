"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconArrowLeft,
	IconLoader2,
	IconLock,
	IconTools,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { useGetContributorScopesQuery } from "../api/contributorEndpoints";
import { getScopeDefinition } from "../constants/scopes";
import { buildScopeStatusMap } from "../utils/scopes";
import type { ContributorScopeRecord } from "../types";
import { AccessStatePanel } from "./AccessStatePanel";

const EMPTY_RECORDS: ContributorScopeRecord[] = [];
const WORKSPACE_PATH = "/guonopedia/contribute/folktales";
const APPLY_HREF = "/guonopedia/contribute/apply?scope=folktales";
const SIGN_IN_HREF = `/signin?next=${encodeURIComponent(WORKSPACE_PATH)}`;

interface FolktaleAccessGateProps {
	children: ReactNode;
}

/**
 * Folktales has its own contribution workspace, so it needs its own access
 * gate. Signed-out visitors, applicants and suspended contributors see the
 * same states as the generic scope pages.
 */
export function FolktaleAccessGate({ children }: FolktaleAccessGateProps) {
	const { t } = useTranslation("common");
	const user = useAppSelector((state) => state.auth.user);
	const definition = getScopeDefinition("folktales");
	const Icon = definition.icon;

	const { data, isLoading, isError, refetch } = useGetContributorScopesQuery(
		user?.id ?? "",
		{ skip: !user?.id },
	);

	if (user && !isLoading && !isError) {
		const record = buildScopeStatusMap(data ?? EMPTY_RECORDS).folktales;
		if (record?.status === "approved") {
			return <>{children}</>;
		}
	}

	let body: ReactNode;

	if (!user) {
		body = (
			<AccessStatePanel
				icon={<IconLock className="h-5 w-5" />}
				title={t("signInToApply")}
				description={t("scopeNotAppliedDescription")}
				actionHref={SIGN_IN_HREF}
				actionLabel={t("login")}
			/>
		);
	} else if (isLoading) {
		body = (
			<div className="flex items-center gap-2 py-10 text-sm text-gray-500">
				<IconLoader2 className="h-5 w-5 animate-spin" />
				{t("loading")}
			</div>
		);
	} else if (isError) {
		body = (
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
		);
	} else {
		const record = buildScopeStatusMap(data ?? EMPTY_RECORDS).folktales;

		if (!record) {
			body = (
				<AccessStatePanel
					icon={<IconTools className="h-5 w-5" />}
					title={t("statusNotApplied")}
					description={t("scopeNotAppliedDescription")}
					actionHref={APPLY_HREF}
					actionLabel={t("applyForThisScope")}
				/>
			);
		} else if (record.status === "pending") {
			body = (
				<AccessStatePanel
					icon={<IconLoader2 className="h-5 w-5" />}
					title={t("statusPending")}
					description={t("scopePendingDescription")}
				/>
			);
		} else if (record.status === "rejected") {
			body = (
				<AccessStatePanel
					icon={<IconLock className="h-5 w-5" />}
					title={t("statusRejected")}
					description={t("scopeRejectedDescription")}
					actionHref={APPLY_HREF}
					actionLabel={t("applyForThisScope")}
				/>
			);
		} else {
			body = (
				<AccessStatePanel
					icon={<IconLock className="h-5 w-5" />}
					title={t("statusSuspended")}
					description={t("scopeSuspendedDescription")}
				/>
			);
		}
	}

	return (
		<main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<Link
				href="/guonopedia/contribute"
				className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
			>
				<IconArrowLeft className="h-4 w-4" />
				{t("backToContributorHub")}
			</Link>

			<header className="flex flex-col gap-3 rounded-3xl bg-[#D4E8EA] p-6 sm:p-8">
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
			</header>

			{body}
		</main>
	);
}
