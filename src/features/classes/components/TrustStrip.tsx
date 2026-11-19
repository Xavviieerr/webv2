"use client";

import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { ClassesSection } from "./ClassesSection";

export function TrustStrip() {
	const { t } = useTranslation("common");

	const claims = [
		t("trustUrhoboOnly"),
		t("trustNativeCoaches"),
		t("trustSpeakWeek1"),
		t("trustCancelAnytime"),
	];

	return (
		<ClassesSection
			tone="teal"
			padding="compact"
			contentClassName="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4"
		>
			{claims.map((claim) => (
				<span
					key={claim}
					className="inline-flex items-center gap-2 text-xs font-semibold text-white/85 sm:text-[13px]"
				>
					<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#8fd0d8]">
						<Check className="h-3 w-3" />
					</span>
					{claim}
				</span>
			))}
		</ClassesSection>
	);
}
