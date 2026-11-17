"use client";

import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { CLASS_COACHES } from "../constants/coaches";

export function Coaches() {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("coachesTitle")}
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{CLASS_COACHES.map((coach) => (
					<div
						key={coach.id}
						className="flex flex-col gap-3 rounded-2xl border-2 border-[#D4E8EA] bg-white p-5"
					>
						<div className="flex items-center justify-between">
							<span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4E8EA] text-lg font-bold text-[#02474F]">
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
							<p className="text-sm leading-relaxed text-[#1A4349]/80">
								{t(coach.descriptionKey)}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
