"use client";

import { useTranslation } from "react-i18next";
import {
	CalendarClock,
	MessageCircle,
	PhoneCall,
	UserCheck,
	Video,
} from "lucide-react";

const AFTER_APPLY_ICONS = [PhoneCall, MessageCircle, UserCheck, Video];

export function PersonalClassesSection() {
	const { t } = useTranslation("common");

	const steps = [
		{
			title: t("afterApplyStep1Title"),
			description: t("afterApplyStep1Description"),
		},
		{
			title: t("afterApplyStep2Title"),
			description: t("afterApplyStep2Description"),
		},
		{
			title: t("afterApplyStep3Title"),
			description: t("afterApplyStep3Description"),
		},
		{
			title: t("afterApplyStep4Title"),
			description: t("afterApplyStep4Description"),
		},
	];

	return (
		<section className="flex flex-col gap-6 rounded-3xl bg-[#FBF5EA] p-5 sm:p-8">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
					{t("afterApplyTitle")}
				</h2>
				<p className="inline-flex items-center gap-2 text-sm text-[#1A4349]/70">
					<CalendarClock className="h-4 w-4" />
					{t("classesProofStart")}
				</p>
			</div>

			<ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{steps.map((step, index) => {
					const Icon = AFTER_APPLY_ICONS[index];
					return (
						<li
							key={step.title}
							className="flex flex-col gap-2 rounded-2xl border-2 border-[#D4E8EA] bg-white p-4"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4E8EA] text-[#02474F]">
								<Icon className="h-4 w-4" />
							</span>
							<h3 className="text-sm font-semibold text-[#02474F]">
								{step.title}
							</h3>
							<p className="text-sm leading-relaxed text-[#1A4349]/80">
								{step.description}
							</p>
						</li>
					);
				})}
			</ol>

			<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
				<p className="text-sm font-semibold text-[#02474F]">
					{t("questionsLabel")}
				</p>
				<a
					href="#apply"
					className="inline-flex items-center justify-center rounded-xl border-2 border-[#D4E8EA] bg-[#F2FEFF] px-4 py-2 text-xs font-bold text-[#02474F] transition-colors hover:border-[#41A3AD]"
				>
					{t("applyForPersonalClasses")}
				</a>
			</div>
		</section>
	);
}
