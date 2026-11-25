"use client";

import { useTranslation } from "react-i18next";
import {
	CalendarCheck,
	MessageCircle,
	UserCheck,
	Video,
} from "lucide-react";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function HowClassesWork() {
	const { t } = useTranslation("common");

	const steps = [
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
	];

	return (
		<ClassesSection tone="tint">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("personalClasses")}
					title={t("howClassesWorkTitle")}
					className="mx-auto max-w-3xl"
				/>

				<ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
					<span
						aria-hidden
						className="absolute left-0 right-0 top-[52px] hidden h-px bg-[#D4E8EA] lg:block"
					/>
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<li
								key={step.title}
								className="relative flex flex-col gap-3 rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-5 lg:p-6"
							>
								<div className="flex items-center justify-between">
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#02474F]">
										<Icon className="h-5 w-5" />
									</span>
									<span className="text-2xl font-bold text-[#02474F]">
										{String(index + 1).padStart(2, "0")}
									</span>
								</div>
								<h3 className="text-sm font-semibold text-[#02474F] sm:text-base">
									{step.title}
								</h3>
								<p className="text-sm leading-relaxed text-[#1A4349]/75">
									{step.description}
								</p>
							</li>
						);
					})}
				</ol>
			</div>
		</ClassesSection>
	);
}
