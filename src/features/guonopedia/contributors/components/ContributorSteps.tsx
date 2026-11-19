"use client";

import { useTranslation } from "react-i18next";
import { IconListCheck, IconSend, IconCircleCheck } from "@tabler/icons-react";

const STEP_ICONS = [IconListCheck, IconSend, IconCircleCheck];

export function ContributorSteps() {
	const { t } = useTranslation("common");

	const steps = [
		{
			title: t("contributorStep1Title"),
			description: t("contributorStep1Description"),
		},
		{
			title: t("contributorStep2Title"),
			description: t("contributorStep2Description"),
		},
		{
			title: t("contributorStep3Title"),
			description: t("contributorStep3Description"),
		},
	];

	return (
		<section className="flex flex-col gap-5">
			<h2 className="text-xl font-semibold text-[#0D4D4D]">
				{t("howContributorsWork")}
			</h2>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{steps.map((step, index) => {
					const Icon = STEP_ICONS[index];
					return (
						<div
							key={step.title}
							className="flex flex-col gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-5"
						>
							<div className="flex items-center gap-3">
								<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0D4D4D]">
									{index + 1}
								</span>
								<Icon className="h-5 w-5 text-[#0D4D4D]/50" />
							</div>
							<h3 className="text-sm font-semibold text-[#0D4D4D]">
								{step.title}
							</h3>
							<p className="text-sm leading-relaxed text-gray-600">
								{step.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
