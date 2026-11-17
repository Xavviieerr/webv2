"use client";

import { useTranslation } from "react-i18next";
import {
	CalendarCheck,
	CheckCircle2,
	Globe2,
	MessageCircle,
	UserCheck,
	Video,
} from "lucide-react";

export function HowClassesWork() {
	const { t } = useTranslation("common");

	const cards = [
		{
			icon: CalendarCheck,
			title: t("classStep1Title"),
			description: t("classStep1Description"),
		},
		{
			icon: MessageCircle,
			title: t("classStep2Title"),
			description: t("classStep2Description"),
		},
		{
			icon: UserCheck,
			title: t("classStep3Title"),
			description: t("classStep3Description"),
		},
		{
			icon: Video,
			title: t("classStep4Title"),
			description: t("classStep4Description"),
		},
		{
			icon: CheckCircle2,
			title: t("includedTitle"),
			description: t("includedDescription"),
		},
		{
			icon: Globe2,
			title: t("diasporaFriendlyTitle"),
			description: t("diasporaFriendlyDescription"),
		},
	];

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("howClassesWorkTitle")}
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{cards.map((card) => {
					const Icon = card.icon;
					return (
						<div
							key={card.title}
							className="flex flex-col gap-3 rounded-2xl border-2 border-[#D4E8EA] bg-white p-5"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4E8EA] text-[#02474F]">
								<Icon className="h-4 w-4" />
							</span>
							<h3 className="text-sm font-semibold text-[#02474F] sm:text-base">
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
