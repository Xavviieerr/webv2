"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconArrowRight, IconUserPlus } from "@tabler/icons-react";
import {
	SCOPE_DEFINITIONS,
	isScopeContributionAvailable,
} from "../../constants/scopes";
import { CONTRIBUTOR_APPLY_PATH } from "../../hooks/useContributorAccess";

/**
 * Signed-out visitors can read what contributing involves, but applying is
 * gated behind an account. The scope list is preview-only here.
 */
export function SignedOutApplicationGate() {
	const { t } = useTranslation("common");
	const availableScopes = SCOPE_DEFINITIONS.filter(
		isScopeContributionAvailable,
	);

	return (
		<section className="overflow-hidden rounded-3xl border border-[#0D4D4D]/10 bg-[#D4E8EA]">
			<div className="flex flex-col gap-5 p-6 sm:p-8">
				<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
					<IconUserPlus className="h-6 w-6" />
				</span>

				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-semibold text-[#0D4D4D]">
						{t("signInToApply")}
					</h2>
					<p className="max-w-2xl text-sm leading-relaxed text-gray-600">
						{t("contributorGateDescription")}
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Link
						href={`/signin?next=${encodeURIComponent(CONTRIBUTOR_APPLY_PATH)}`}
						className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("login")}
						<IconArrowRight className="h-4 w-4" />
					</Link>
					<Link
						href="/signup"
						className="inline-flex items-center justify-center rounded-full border border-[#0D4D4D]/20 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40 hover:bg-[#F2FEFF]"
					>
						{t("createAccount")}
					</Link>
				</div>

				<p className="text-xs text-gray-500">{t("contributorGateNote")}</p>
			</div>

			<div className="border-t border-[#0D4D4D]/10 bg-[#F2FEFF] p-6 sm:p-8">
				<h3 className="text-base font-semibold text-[#0D4D4D]">
					{t("chooseScopes")}
				</h3>
				<p className="mt-1 text-sm text-gray-600">
					{t("chooseScopesDescription")}
				</p>

				<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{availableScopes.map((definition) => {
						const Icon = definition.icon;
						return (
							<div
								key={definition.value}
								className="flex items-start gap-3 rounded-xl border border-[#0D4D4D]/10 bg-white p-3"
							>
								<span
									className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
									style={{
										backgroundColor: `${definition.color}1A`,
										color: definition.color,
									}}
								>
									<Icon className="h-4 w-4" />
								</span>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-[#0D4D4D]">
										{t(definition.labelKey)}
									</p>
									<p className="text-xs leading-relaxed text-gray-600">
										{t(definition.descriptionKey)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
