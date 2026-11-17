"use client";

import { useTranslation } from "react-i18next";
import { LEARNING_LEVELS } from "../constants/levels";

export function LearningPath() {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
					{t("learningPathTitle")}
				</h2>
				<p className="text-sm text-[#1A4349]/70">
					{t("learningPathDescription")}
				</p>
			</div>

			<div className="flex flex-col gap-3">
				{LEARNING_LEVELS.map((level) => (
					<div
						key={level.id}
						className={`flex items-center gap-4 rounded-2xl border-2 bg-white p-4 ${
							level.id === 7
								? "border-[#41A3AD]"
								: "border-[#D4E8EA]"
						} ${level.id % 2 === 0 ? "lg:ml-12" : "lg:mr-12"}`}
					>
						<span className="text-2xl sm:text-3xl">{level.emoji}</span>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-bold text-[#02474F] sm:text-base">
								{t(level.titleKey)}
							</p>
							<p className="text-xs text-[#1A4349]/70 sm:text-sm">
								{t(level.descriptionKey)}
							</p>
						</div>
						<span className="shrink-0 text-xs font-bold text-[#0E808D] sm:text-sm">
							{level.id === 7 ? "🏆" : level.xp}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
