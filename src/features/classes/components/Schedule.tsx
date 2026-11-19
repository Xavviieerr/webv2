"use client";

import { useTranslation } from "react-i18next";
import { Globe2, MapPin, Timer } from "lucide-react";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function Schedule() {
	const { t } = useTranslation("common");

	const zones = [
		{
			icon: Globe2,
			title: t("timezoneLagos"),
			description: t("timezoneLagosDescription"),
		},
		{
			icon: Timer,
			title: t("timezoneLondon"),
			description: t("timezoneLondonDescription"),
		},
		{
			icon: MapPin,
			title: t("timezoneUs"),
			description: t("timezoneUsDescription"),
		},
	];

	const chips = [
		t("scheduleWeekdays"),
		t("scheduleWeekends"),
		t("sessionMorning"),
		t("sessionAfternoon"),
		t("sessionEvening"),
		"Zoom",
		"Google Meet",
		"WhatsApp",
	];

	return (
		<ClassesSection tone="teal">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
				<div className="flex flex-col gap-6">
					<SectionHeading
						onDark
						eyebrow={t("scheduleEyebrow")}
						title={t("scheduleTitle")}
						description={t("scheduleDescription")}
					/>
					<div className="flex flex-wrap gap-2">
						{chips.map((chip) => (
							<span
								key={chip}
								className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80"
							>
								{chip}
							</span>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{zones.map((zone) => {
						const Icon = zone.icon;
						return (
							<div
								key={zone.title}
								className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 p-5"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#8fd0d8]">
									<Icon className="h-4 w-4" />
								</span>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-semibold text-white">
										{zone.title}
									</p>
									<p className="text-xs leading-relaxed text-white/60">
										{zone.description}
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
