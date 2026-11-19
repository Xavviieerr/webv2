"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { LEARNING_LEVELS } from "../constants/levels";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function LearningPath() {
	const { t } = useTranslation("common");

	return (
		<ClassesSection tone="cream">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
				<div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
					<SectionHeading
						eyebrow={t("levelsRange")}
						title={t("learningPathTitle")}
						description={t("learningPathDescription")}
					/>
					<p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#02474F]">
						<span className="h-1.5 w-1.5 rounded-full bg-[#0E808D]" />
						{t("classesProofStart")}
					</p>
					<Link
						href="#apply"
						className="inline-flex w-fit items-center gap-2 rounded-xl border-2 border-[#02474F]/15 bg-white px-5 py-3 text-sm font-bold text-[#02474F] transition-colors hover:border-[#41A3AD]"
					>
						{t("applyForPersonalClasses")}
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<ol className="relative flex flex-col gap-3">
					<span
						aria-hidden
						className="absolute left-[19px] top-6 bottom-6 w-px bg-[#D4E8EA]"
					/>
					{LEARNING_LEVELS.map((level) => {
						const isFinal = level.id === LEARNING_LEVELS.length;
						return (
							<li
								key={level.id}
								className={`relative flex items-start gap-4 rounded-2xl border p-4 pl-12 sm:p-5 sm:pl-14 ${
									isFinal
										? "border-[#41A3AD] bg-[#02474F] text-white"
										: "border-[#D4E8EA] bg-white"
								}`}
							>
								<span
									className={`absolute left-[7px] top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold sm:left-[9px] ${
										isFinal
											? "bg-[#41A3AD] text-[#02474F]"
											: "border border-[#D4E8EA] bg-white text-[#0E808D]"
									}`}
								>
									{level.id}
								</span>

								<span className="text-2xl leading-none">{level.emoji}</span>

								<div className="min-w-0 flex-1">
									<p
										className={`text-sm font-bold sm:text-[15px] ${
											isFinal ? "text-white" : "text-[#02474F]"
										}`}
									>
										{t(level.titleKey)}
									</p>
									<p
										className={`mt-0.5 text-xs leading-relaxed sm:text-[13px] ${
											isFinal ? "text-white/70" : "text-[#1A4349]/70"
										}`}
									>
										{t(level.descriptionKey)}
									</p>
								</div>

								<span
									className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
										isFinal
											? "bg-white/10 text-white"
											: "bg-[#D4E8EA] text-[#02474F]"
									}`}
								>
									{isFinal ? "🏆" : level.xp}
								</span>
							</li>
						);
					})}
				</ol>
			</div>
		</ClassesSection>
	);
}
