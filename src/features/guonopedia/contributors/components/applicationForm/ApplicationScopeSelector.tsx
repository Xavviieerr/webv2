"use client";

import { useTranslation } from "react-i18next";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
	SCOPE_DEFINITIONS,
	isScopeContributionAvailable,
} from "../../constants/scopes";
import type { ContributorScope } from "../../types";
import {
	isLockedContributorStatus,
	type ScopeStatusMap,
} from "../../utils/scopes";
import { StatusBadge } from "../StatusBadge";

export function ApplicationScopeSelector({
	selected,
	statusMap,
	error,
	onToggle,
}: {
	selected: ContributorScope[];
	statusMap: ScopeStatusMap;
	error?: string;
	onToggle: (scope: ContributorScope) => void;
}) {
	const { t } = useTranslation("common");
	const availableScopes = SCOPE_DEFINITIONS.filter(
		isScopeContributionAvailable,
	);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold text-[#0D4D4D]">
					{t("chooseScopes")}
				</h2>
				<p className="text-sm text-gray-600">
					{t("chooseScopesDescription")}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{availableScopes.map((definition) => {
					const Icon = definition.icon;
					const record = statusMap[definition.value];
					const locked = isLockedContributorStatus(record?.status);
					const isSelected = selected.includes(definition.value);

					return (
						<button
							key={definition.value}
							type="button"
							aria-pressed={isSelected}
							disabled={locked}
							onClick={() => onToggle(definition.value)}
							className={cn(
								"flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
								locked
									? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-80"
									: isSelected
										? "border-[#0D4D4D] bg-white"
										: "border-[#0D4D4D]/15 bg-white/60 hover:border-[#0D4D4D]/40 hover:bg-white",
							)}
						>
							<span
								className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
								style={{ backgroundColor: definition.color }}
							>
								<Icon className="h-4 w-4 text-white" />
							</span>
							<span className="flex min-w-0 flex-1 flex-col gap-1">
								<span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#0D4D4D]">
									{t(definition.labelKey)}
									{locked && record && (
										<StatusBadge status={record.status} />
									)}
								</span>
								<span className="text-xs leading-relaxed text-gray-600">
									{t(definition.descriptionKey)}
								</span>
							</span>
							{isSelected && !locked && (
								<IconCheck className="mt-1 h-4 w-4 shrink-0 text-[#0D4D4D]" />
							)}
						</button>
					);
				})}
			</div>

			{error && (
				<p className="text-xs font-medium text-red-600">{t(error)}</p>
			)}
		</section>
	);
}
