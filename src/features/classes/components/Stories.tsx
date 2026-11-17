"use client";

import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import { LEARNER_STORIES } from "../constants/stories";

export function Stories() {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("learnerStoriesTitle")}
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{LEARNER_STORIES.map((story) => (
					<figure
						key={story.id}
						className="flex flex-col gap-3 rounded-2xl border-2 border-[#D4E8EA] bg-[#F2FEFF] p-5"
					>
						<Quote className="h-5 w-5 text-[#41A3AD]" />
						<blockquote className="flex-1 text-sm leading-relaxed text-[#02474F]">
							{t(story.quoteKey)}
						</blockquote>
						<figcaption className="text-xs font-bold text-[#1A4349]/60">
							{t(story.authorKey)}
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
