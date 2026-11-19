"use client";

import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { CLASS_COACHES } from "../constants/coaches";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function Coaches() {
	const { t } = useTranslation("common");

	return (
		<ClassesSection tone="white">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("classesEyebrow")}
					title={t("coachesTitle")}
					className="mx-auto max-w-3xl"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
					{CLASS_COACHES.map((coach) => (
						<div
							key={coach.id}
							className="flex flex-col gap-4 rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-6 transition-all hover:border-[#41A3AD] hover:shadow-[0_24px_50px_-38px_rgba(2,71,79,0.6)] lg:p-7"
						>
							<div className="flex items-center justify-between">
								<span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-[#02474F]">
									{t(coach.nameKey).charAt(0)}
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-[#FBF5EA] px-2.5 py-1 text-[11px] font-bold text-[#02474F]">
									<Star className="h-3 w-3 fill-[#FFC800] text-[#FFC800]" />
									{coach.rating}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<h3 className="text-base font-semibold text-[#02474F]">
									{t(coach.nameKey)}
								</h3>
								<p className="text-[11px] font-bold uppercase tracking-wide text-[#0E808D]">
									{t(coach.tagKey)}
								</p>
							</div>

							<p className="text-sm leading-relaxed text-[#1A4349]/75">
								{t(coach.descriptionKey)}
							</p>

							<p className="mt-auto border-t border-[#02474F]/10 pt-3 text-[11px] font-semibold text-[#1A4349]/55">
								{coach.years} {t("yearsCoaching")}
							</p>
						</div>
					))}
				</div>
			</div>
		</ClassesSection>
	);
}
