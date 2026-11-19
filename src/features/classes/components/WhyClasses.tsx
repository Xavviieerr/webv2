"use client";

import { useTranslation } from "react-i18next";
import { Globe2, HeartHandshake, Users } from "lucide-react";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function WhyClasses() {
	const { t } = useTranslation("common");

	const cards = [
		{
			icon: Globe2,
			title: t("reconnectRootsTitle"),
			description: t("reconnectRootsDescription"),
		},
		{
			icon: Users,
			title: t("speakWithFamilyTitle"),
			description: t("speakWithFamilyDescription"),
		},
		{
			icon: HeartHandshake,
			title: t("keepLanguageAliveTitle"),
			description: t("keepLanguageAliveDescription"),
		},
	];

	return (
		<ClassesSection tone="white">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("personalClasses")}
					title={t("whyUrhoboTitle")}
					className="mx-auto max-w-3xl"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
					{cards.map((card) => {
						const Icon = card.icon;
						return (
							<div
								key={card.title}
								className="group flex flex-col gap-4 rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-6 transition-all hover:-translate-y-1 hover:border-[#41A3AD] hover:shadow-[0_24px_50px_-38px_rgba(2,71,79,0.6)] lg:p-8"
							>
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#02474F] transition-colors group-hover:bg-[#02474F] group-hover:text-white">
									<Icon className="h-5 w-5" />
								</span>
								<h3 className="text-lg font-semibold text-[#02474F]">
									{card.title}
								</h3>
								<p className="text-sm leading-relaxed text-[#1A4349]/75">
									{card.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</ClassesSection>
	);
}
