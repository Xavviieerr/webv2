"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconArrowLeft, IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import { getContributorPolicyContent } from "../constants/contributorPolicy";

const APPLY_HREF = "/guonopedia/contribute/apply";

export function ContributorPolicyPage() {
	const { t, i18n } = useTranslation("common");
	const policy = getContributorPolicyContent(i18n.language);
	const showEnglishNotice = !i18n.language
		?.toLowerCase()
		.startsWith("urhobo");

	return (
		<main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<Link
				href={APPLY_HREF}
				className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
			>
				<IconArrowLeft className="h-4 w-4" />
				{t("backToApplication")}
			</Link>

			<header className="flex flex-col gap-3 rounded-3xl bg-[#D4E8EA] p-6 sm:p-8">
				<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
					<IconShieldCheck className="h-6 w-6" />
				</span>
				<h1 className="text-3xl font-semibold text-[#0D4D4D] sm:text-4xl">
					{policy.title}
				</h1>
				<p className="max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
					{policy.intro}
				</p>
				{showEnglishNotice && (
					<p className="text-xs font-medium text-[#0D4D4D]/60">
						{t("policyEnglishNotice")}
					</p>
				)}
			</header>

			<nav className="flex flex-col gap-2 rounded-2xl border border-[#0D4D4D]/10 bg-[#F2FEFF] p-5">
				<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D4D4D]/50">
					{t("policyContents")}
				</p>
				<ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
					{policy.sections.map((section) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className="text-sm text-[#0D4D4D]/80 hover:text-[#0D4D4D] hover:underline"
							>
								{section.title}
							</a>
						</li>
					))}
				</ol>
			</nav>

			<div className="flex flex-col gap-6">
				{policy.sections.map((section) => (
					<section
						key={section.id}
						id={section.id}
						className="flex scroll-mt-24 flex-col gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-5 sm:p-6"
					>
						<h2 className="text-lg font-semibold text-[#0D4D4D]">
							{section.title}
						</h2>
						{section.paragraphs.map((paragraph) => (
							<p
								key={paragraph}
								className="text-sm leading-relaxed text-gray-700"
							>
								{paragraph}
							</p>
						))}
						{section.bullets && (
							<ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-gray-700">
								{section.bullets.map((bullet) => (
									<li key={bullet}>{bullet}</li>
								))}
							</ul>
						)}
					</section>
				))}
			</div>

			<div className="flex flex-col items-start gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#FBF5EA] p-5 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-[#0D4D4D]/80">
					{t("policyAcceptHint")}
				</p>
				<Link
					href={APPLY_HREF}
					className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					{t("continueToApplication")}
					<IconArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</main>
	);
}
