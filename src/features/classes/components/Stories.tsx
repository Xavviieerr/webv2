"use client";

import { useTranslation } from "react-i18next";
import { Quote, Star } from "lucide-react";
import { LEARNER_STORIES } from "../constants/stories";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function Stories() {
	const { t } = useTranslation("common");

	return (
		<ClassesSection tone="cream">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("classesProofDiaspora")}
					title={t("learnerStoriesTitle")}
					className="mx-auto max-w-3xl"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
					{LEARNER_STORIES.map((story) => (
						<figure
							key={story.id}
							className="flex flex-col gap-4 rounded-3xl bg-white p-6 lg:p-7"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-0.5">
									{Array.from({ length: 5 }).map((_, index) => (
										<Star
											key={index}
											className="h-3.5 w-3.5 fill-[#FFC800] text-[#FFC800]"
										/>
									))}
								</div>
								<Quote className="h-4 w-4 text-[#41A3AD]" />
							</div>

							<blockquote className="flex-1 text-sm leading-relaxed text-[#02474F]">
								{t(story.quoteKey)}
							</blockquote>

							<figcaption className="border-t border-[#D4E8EA] pt-4 text-xs font-bold text-[#1A4349]/60">
								{t(story.authorKey)}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</ClassesSection>
	);
}
