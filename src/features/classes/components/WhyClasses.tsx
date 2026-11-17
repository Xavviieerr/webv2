"use client";

import { useTranslation } from "react-i18next";
import { Globe2, HeartHandshake, Users } from "lucide-react";

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
		<section className="flex flex-col gap-6">
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("whyUrhoboTitle")}
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{cards.map((card) => {
					const Icon = card.icon;
					return (
						<div
							key={card.title}
							className="flex flex-col gap-3 rounded-2xl border-2 border-[#D4E8EA] bg-white p-5"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4E8EA] text-[#02474F]">
								<Icon className="h-5 w-5" />
							</span>
							<h3 className="text-base font-semibold text-[#02474F]">
								{card.title}
							</h3>
							<p className="text-sm leading-relaxed text-[#1A4349]/80">
								{card.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
