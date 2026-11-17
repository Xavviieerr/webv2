"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Star } from "lucide-react";

export function ClassesHero() {
	const { t } = useTranslation("common");

	return (
		<section className="relative overflow-hidden rounded-3xl bg-[#FBF5EA] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
			<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="flex flex-col gap-5">
					<span className="w-fit rounded-full bg-[#D4E8EA] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#02474F]">
						{t("classesEyebrow")}
					</span>
					<h1 className="text-3xl font-semibold leading-[1.05] text-[#02474F] sm:text-5xl">
						<span className="block">{t("classesTitleLine1")}</span>
						<span className="block">{t("classesTitleLine2")}</span>
						<span className="block text-[#41A3AD]">
							{t("classesTitleLine3")}
						</span>
					</h1>
					<p className="max-w-xl text-sm leading-relaxed text-[#1A4349]/80 sm:text-base">
						{t("classesSubtitle")}
					</p>

					<div className="flex flex-col gap-3 sm:flex-row">
						<Link
							href="#apply"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							{t("applyForPersonalClasses")}
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							href="#apply"
							className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#D4E8EA] bg-white px-5 py-3 text-sm font-bold text-[#02474F] transition-colors hover:bg-[#F2FEFF]"
						>
							{t("takeFreePlacementTest")}
						</Link>
					</div>

					<div className="flex flex-wrap gap-2">
						{[
							t("classesTagMigwo"),
							t("classesTagVren"),
							t("classesTagUdi"),
						].map((tag) => (
							<span
								key={tag}
								className="rounded-full bg-[#D4E8EA] px-3 py-1 text-[11px] font-bold text-[#02474F]"
							>
								{tag}
							</span>
						))}
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#1A4349]/70 sm:text-sm">
						<span className="inline-flex items-center gap-1 font-semibold text-[#02474F]">
							<Star className="h-4 w-4 fill-[#FFC800] text-[#FFC800]" />
							{t("classesProofRating")}
						</span>
						<span>•</span>
						<span>{t("classesProofLearners")}</span>
						<span>•</span>
						<span>{t("classesProofStart")}</span>
						<span>•</span>
						<span>{t("classesProofDiaspora")}</span>
					</div>
				</div>

				<div className="rounded-3xl border-2 border-[#D4E8EA] bg-white p-5">
					<div className="flex items-center justify-between text-sm font-bold text-[#02474F]">
						<span>{t("learningPathTitle")}</span>
						<span className="rounded-full bg-[#D4E8EA] px-2 py-0.5 text-[10px] text-[#02474F]">
							{t("classesProofStart")}
						</span>
					</div>
					<div className="mt-4 h-3 overflow-hidden rounded-full bg-[#D4E8EA]">
						<div className="h-full w-[72%] rounded-full bg-[#41A3AD]" />
					</div>
					<div className="mt-4 flex flex-col gap-2.5">
						{[
							{ emoji: "👋", title: t("level1Title") },
							{ emoji: "🏠", title: t("level2Title") },
							{ emoji: "🍲", title: t("level3Title") },
						].map((item, index) => (
							<div
								key={item.title}
								className="flex items-center gap-3 rounded-2xl border-2 border-[#D4E8EA] bg-[#F2FEFF] px-3 py-2.5"
							>
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEDCA] text-base">
									{item.emoji}
								</span>
								<div className="min-w-0">
									<p className="truncate text-xs font-bold text-[#02474F]">
										{item.title}
									</p>
									<p className="text-[10px] text-[#1A4349]/70">
										{index === 0
											? t("level1Description")
											: index === 1
												? t("level2Description")
												: t("level3Description")}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
