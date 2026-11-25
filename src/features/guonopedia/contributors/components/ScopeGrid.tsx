"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconArrowRight } from "@tabler/icons-react";
import {
	SCOPE_DEFINITIONS,
	isScopeContributionAvailable,
} from "../constants/scopes";
import type { ScopeStatusMap } from "../utils/scopes";
import { StatusBadge } from "./StatusBadge";

interface ScopeGridProps {
	statusMap: ScopeStatusMap;
	isAuthenticated: boolean;
}

export function ScopeGrid({ statusMap, isAuthenticated }: ScopeGridProps) {
	const { t } = useTranslation("common");

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{SCOPE_DEFINITIONS.filter(isScopeContributionAvailable).map((definition) => {
				const record = statusMap[definition.value];
				const Icon = definition.icon;
				const hasRecord = Boolean(record);
				const href = hasRecord
					? `/guonopedia/contribute/${definition.value}`
					: `/guonopedia/contribute/apply?scope=${definition.value}`;

				return (
					<Link
						key={definition.value}
						href={href}
						className="group flex flex-col gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-5 transition-all hover:-translate-y-0.5 hover:border-[#0D4D4D]/25 hover:shadow-md"
					>
						<div className="flex items-start justify-between gap-3">
							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl"
								style={{ backgroundColor: definition.color }}
							>
								<Icon className="h-5 w-5 text-white" />
							</div>
							<StatusBadge status={record?.status} />
						</div>

						<div className="flex flex-col gap-1">
							<h3 className="text-base font-semibold text-[#0D4D4D]">
								{t(definition.labelKey)}
							</h3>
							<p className="text-sm leading-relaxed text-gray-600">
								{t(definition.descriptionKey)}
							</p>
						</div>

						<div className="mt-auto flex items-center justify-between pt-2">
							{record ? (
								<span className="text-[11px] text-gray-500">
									{t("submissionsLabel")}:{" "}
									{record.submissionCount ?? 0}
								</span>
							) : (
								<span className="text-[11px] text-gray-500">
									{isAuthenticated
										? t("startApplication")
										: t("signInToApply")}
								</span>
							)}
							<span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D4D4D]">
								{hasRecord ? t("viewApplicationStatus") : t("applyForThisScope")}
								<IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
