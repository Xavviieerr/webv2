"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock3, Sparkles, Star } from "lucide-react";
import { ClassesSection } from "./ClassesSection";

const PREVIEW_LEVELS = [
	{ emoji: "👋", titleKey: "level1Title", descriptionKey: "level1Description" },
	{ emoji: "🏠", titleKey: "level2Title", descriptionKey: "level2Description" },
	{ emoji: "🍲", titleKey: "level3Title", descriptionKey: "level3Description" },
];

export function ClassesHero() {
	const { t } = useTranslation("common");

	return (
		<ClassesSection
			tone="tint"
			padding="hero"
			contentClassName="relative overflow-hidden"
		>
			{/* Soft brand wash behind the hero content. */}
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#D4E8EA]/70 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-32 left-1/4 h-[360px] w-[360px] rounded-full bg-[#FBEDCA]/60 blur-3xl"
			/>

			<div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
				<div className="flex flex-col gap-6">
					<span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#02474F]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#02474F]">
						<span className="h-1.5 w-1.5 rounded-full bg-[#0E808D]" />
						{t("classesEyebrow")}
					</span>

					<h1 className="text-[34px] font-semibold leading-[1.02] tracking-tight text-[#02474F] sm:text-5xl lg:text-[58px]">
						<span className="block">{t("classesTitleLine1")}</span>
						<span className="block">{t("classesTitleLine2")}</span>
						<span className="block text-[#41A3AD]">
							{t("classesTitleLine3")}
						</span>
					</h1>

					<p className="max-w-xl text-sm leading-relaxed text-[#1A4349]/80 sm:text-base">
						{t("classesSubtitle")}
					</p>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<Link
							href="#apply"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							{t("applyForPersonalClasses")}
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							href="#pricing"
							className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#D4E8EA] bg-white px-6 py-3.5 text-sm font-bold text-[#02474F] transition-colors hover:border-[#41A3AD] hover:bg-[#F2FEFF]"
						>
							{t("seeLevelsPricing")}
						</Link>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{[
							t("classesTagMigwo"),
							t("classesTagVren"),
							t("classesTagUdi"),
						].map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-[#D4E8EA] bg-white px-3 py-1 text-[11px] font-semibold text-[#02474F]"
							>
								{tag}
							</span>
						))}
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#1A4349]/70 sm:text-sm">
						<span className="inline-flex items-center gap-1.5 font-semibold text-[#02474F]">
							<Star className="h-4 w-4 fill-[#FFC800] text-[#FFC800]" />
							{t("classesProofRating")}
						</span>
						<span aria-hidden className="h-1 w-1 rounded-full bg-[#1A4349]/30" />
						<span>{t("classesProofLearners")}</span>
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
					<div className="rounded-[28px] border border-[#D4E8EA] bg-white/60 p-3 backdrop-blur-sm">
						<div className="rounded-3xl bg-white p-5 shadow-[0_24px_70px_-40px_rgba(2,71,79,0.65)] sm:p-6">
							<div className="flex items-center justify-between gap-3">
								<p className="text-sm font-bold text-[#02474F]">
									{t("landingPathTitle")}
								</p>
								<span className="rounded-full bg-[#D4E8EA] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#02474F]">
									{t("levelsRange")}
								</span>
							</div>

							<div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#D4E8EA]">
								<div className="h-full w-[38%] rounded-full bg-[#41A3AD]" />
							</div>
							<p className="mt-2 text-[11px] text-[#1A4349]/60">
								{t("classesProofStart")}
							</p>

							<div className="mt-4 flex flex-col gap-2.5">
								{PREVIEW_LEVELS.map((level, index) => (
									<div
										key={level.titleKey}
										className="flex items-center gap-3 rounded-2xl border border-[#D4E8EA] bg-[#F2FEFF] px-3 py-3"
									>
										<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEDCA] text-lg">
											{level.emoji}
										</span>
										<div className="min-w-0 flex-1">
											<p className="truncate text-xs font-bold text-[#02474F]">
												{t(level.titleKey)}
											</p>
											<p className="truncate text-[11px] text-[#1A4349]/70">
												{t(level.descriptionKey)}
											</p>
										</div>
										<span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#0E808D]">
											{index === 0 ? "▸" : "•"}
										</span>
									</div>
								))}
							</div>

							<div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-[#02474F] px-3.5 py-2.5 text-white">
								<span className="inline-flex items-center gap-2 text-[11px] font-semibold">
									<Clock3 className="h-3.5 w-3.5" />
									{t("liveSessionChip")}
								</span>
								<span className="inline-flex items-center gap-1 text-[11px] text-white/70">
									<Sparkles className="h-3 w-3" />
									{t("classesProofDiaspora")}
								</span>
							</div>
						</div>
					</div>

					<span className="absolute -right-2 -top-4 rounded-full bg-[#FBEDCA] px-3.5 py-1.5 text-[11px] font-bold text-[#02474F] shadow-sm sm:-right-4">
						{t("proofFreePlacement")}
					</span>
				</div>
			</div>
		</ClassesSection>
	);
}
