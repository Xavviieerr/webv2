"use client";

import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";
import { CLASS_PACKAGES } from "../constants/packages";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";
import { useClassesPackage } from "./ClassesPackageContext";

export function Pricing() {
	const { t } = useTranslation("common");
	const { selectedPackage, selectPackage } = useClassesPackage();

	const choose = (packageId: string) => {
		selectPackage(packageId);
		document
			.getElementById("apply")
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<ClassesSection id="pricing" tone="white">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("personalClasses")}
					title={t("pricingTitle")}
					description={t("pricingDescription")}
					className="mx-auto max-w-3xl"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
					{CLASS_PACKAGES.map((item) => {
						const isSelected = selectedPackage === item.id;
						return (
							<div
								key={item.id}
								className={`relative flex flex-col gap-5 rounded-3xl p-6 lg:p-7 ${
									item.popular
										? "bg-[#02474F] text-white shadow-[0_30px_70px_-45px_rgba(2,71,79,0.9)]"
										: "border border-[#02474F]/15 bg-[#D4E8EA]"
								} ${isSelected ? "ring-2 ring-[#41A3AD] ring-offset-2" : ""}`}
							>
								{item.popular && (
									<span className="absolute -top-3 left-6 rounded-full bg-[#FBEDCA] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#02474F]">
										{t("mostPopular")}
									</span>
								)}

								<div className="flex flex-col gap-1">
									<h3
										className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
											item.popular ? "text-white/60" : "text-[#1A4349]/60"
										}`}
									>
										{t(item.nameKey)}
									</h3>
									<p
										className={`mt-1 text-3xl font-semibold ${
											item.popular ? "text-white" : "text-[#02474F]"
										}`}
									>
										{item.priceNaira}
										<span
											className={`text-sm font-medium ${
												item.popular ? "text-white/60" : "text-[#1A4349]/50"
											}`}
										>
											{" "}
											{t("perMonth")}
										</span>
									</p>
									<p
										className={`text-xs ${
											item.popular ? "text-white/60" : "text-[#1A4349]/50"
										}`}
									>
										{item.priceUsd}
									</p>
									<p
										className={`text-sm font-semibold ${
											item.popular ? "text-[#8fd0d8]" : "text-[#0E808D]"
										}`}
									>
										{t(item.sessionsKey)}
									</p>
								</div>

								<ul
									className={`flex flex-col gap-2.5 border-t pt-5 ${
										item.popular ? "border-white/15" : "border-[#02474F]/10"
									}`}
								>
									{item.featureKeys.map((featureKey) => (
										<li
											key={featureKey}
											className={`flex items-start gap-2 text-sm ${
												item.popular ? "text-white/85" : "text-[#1A4349]/80"
											}`}
										>
											<Check className="mt-0.5 h-4 w-4 shrink-0 text-[#41A3AD]" />
											<span>{t(featureKey)}</span>
										</li>
									))}
								</ul>

								<button
									type="button"
									onClick={() => choose(item.id)}
									className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
										item.popular
											? "bg-white text-[#02474F] hover:bg-[#FBF5EA]"
											: "border-2 border-[#02474F]/15 bg-white text-[#02474F] hover:border-[#41A3AD] hover:bg-[#F2FEFF]"
									}`}
								>
									{t(item.ctaKey)}
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</ClassesSection>
	);
}
