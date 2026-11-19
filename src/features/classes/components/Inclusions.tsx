"use client";

import { useTranslation } from "react-i18next";
import {
	BookOpen,
	Home,
	MessageCircle,
	Mic,
	PlayCircle,
	Route,
	Sparkles,
	Video,
} from "lucide-react";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function Inclusions() {
	const { t } = useTranslation("common");

	const items = [
		{
			icon: Video,
			title: t("inclusionLiveTitle"),
			description: t("inclusionLiveDescription"),
		},
		{
			icon: Mic,
			title: t("inclusionPronunciationTitle"),
			description: t("inclusionPronunciationDescription"),
		},
		{
			icon: Route,
			title: t("inclusionPlanTitle"),
			description: t("inclusionPlanDescription"),
		},
		{
			icon: Home,
			title: t("inclusionFamilyTitle"),
			description: t("inclusionFamilyDescription"),
		},
		{
			icon: Sparkles,
			title: t("inclusionCultureTitle"),
			description: t("inclusionCultureDescription"),
		},
		{
			icon: PlayCircle,
			title: t("inclusionRecordingTitle"),
			description: t("inclusionRecordingDescription"),
		},
		{
			icon: BookOpen,
			title: t("inclusionPracticeTitle"),
			description: t("inclusionPracticeDescription"),
		},
		{
			icon: MessageCircle,
			title: t("inclusionSupportTitle"),
			description: t("inclusionSupportDescription"),
		},
	];

	return (
		<ClassesSection tone="cream">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("inclusionsEyebrow")}
					title={t("includedTitle")}
					description={t("includedDescription")}
					className="mx-auto max-w-3xl"
				/>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.title}
								className="flex flex-col gap-3 rounded-2xl bg-white p-4 lg:p-5"
							>
								<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBF5EA] text-[#02474F]">
									<Icon className="h-4 w-4" />
								</span>
								<div className="flex flex-col gap-1">
									<h3 className="text-sm font-semibold text-[#02474F]">
										{item.title}
									</h3>
									<p className="text-xs leading-relaxed text-[#1A4349]/70">
										{item.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</ClassesSection>
	);
}
