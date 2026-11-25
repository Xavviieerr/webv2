"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconArrowRight } from "@tabler/icons-react";
import { SCOPE_DEFINITIONS } from "../../constants/scopes";
import { CONTRIBUTOR_APPLY_PATH } from "../../hooks/useContributorAccess";
import type { ApplyContributorResponse } from "../../types";
import { isContributorStatus } from "../../utils/scopes";
import { StatusBadge } from "../StatusBadge";

export function ApplicationResult({
	result,
}: {
	result: ApplyContributorResponse;
}) {
	const { t } = useTranslation("common");
	const applied = result.data.applied;
	const skipped = result.data.skipped;
	const hasApplied = applied.length > 0;

	return (
		<section className="flex flex-col gap-5 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6 sm:p-8">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[#0D4D4D]">
					{hasApplied
						? t("applicationSubmitted")
						: t("applicationSkippedTitle")}
				</h2>
				<p className="max-w-2xl text-sm leading-relaxed text-gray-600">
					{hasApplied
						? t("applicationSubmittedDescription")
						: t("applicationSkippedDescription")}
				</p>
			</div>

			{applied.length > 0 && (
				<div className="flex flex-col gap-2">
					{applied.map((record) => {
						const definition = SCOPE_DEFINITIONS.find(
							(item) => item.value === record.scope,
						);
						return (
							<div
								key={record.id}
								className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#0D4D4D]/10 px-4 py-3"
							>
								<span className="text-sm font-semibold text-[#0D4D4D]">
									{definition
										? t(definition.labelKey)
										: String(record.scope)}
								</span>
								<StatusBadge
									status={
										isContributorStatus(String(record.status))
											? record.status
											: undefined
									}
								/>
							</div>
						);
					})}
				</div>
			)}

			{skipped.length > 0 && (
				<div className="flex flex-col gap-2">
					<h3 className="text-sm font-semibold text-[#0D4D4D]">
						{t("applicationSkippedTitle")}
					</h3>
					{skipped.map((item) => {
						const definition = SCOPE_DEFINITIONS.find(
							(entry) => entry.value === item.scope,
						);
						return (
							<div
								key={`${item.scope}-${item.reason}`}
								className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
							>
								<span className="font-semibold">
									{definition
										? t(definition.labelKey)
										: item.scope}
								</span>
								<span className="block text-xs text-amber-800">
									{item.reason}
								</span>
							</div>
						);
					})}
				</div>
			)}

			<div className="flex flex-wrap gap-3">
				<Link
					href="/guonopedia/contribute"
					className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					{t("backToContributorHub")}
					<IconArrowRight className="h-4 w-4" />
				</Link>
				<Link
					href={CONTRIBUTOR_APPLY_PATH}
					className="inline-flex items-center gap-2 rounded-full border border-[#0D4D4D]/30 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]"
				>
					{t("applyForThisScope")}
				</Link>
			</div>
		</section>
	);
}
