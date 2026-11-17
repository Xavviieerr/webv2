"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { CLASS_PACKAGES } from "../constants/packages";

export function Pricing() {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
					{t("pricingTitle")}
				</h2>
				<p className="text-sm text-[#1A4349]/70">
					{t("pricingDescription")}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{CLASS_PACKAGES.map((item) => (
					<div
						key={item.id}
						className={`relative flex flex-col gap-4 rounded-2xl border-2 bg-white p-5 ${
							item.popular
								? "border-[#41A3AD] shadow-md"
								: "border-[#D4E8EA]"
						}`}
					>
						{item.popular && (
							<span className="absolute -top-3 left-5 rounded-full bg-[#02474F] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
								{t("mostPopular")}
							</span>
						)}

						<div className="flex flex-col gap-1">
							<h3 className="text-sm font-bold uppercase tracking-wide text-[#1A4349]/70">
								{t(item.nameKey)}
							</h3>
							<p className="text-2xl font-semibold text-[#02474F]">
								{item.priceNaira}
								<span className="text-sm font-medium text-[#1A4349]/60">
									{" "}
									{t("perMonth")}
								</span>
							</p>
							<p className="text-xs text-[#1A4349]/60">{item.priceUsd}</p>
							<p className="text-sm font-semibold text-[#0E808D]">
								{t(item.sessionsKey)}
							</p>
						</div>

						<ul className="flex flex-col gap-2">
							{item.featureKeys.map((featureKey) => (
								<li
									key={featureKey}
									className="flex items-start gap-2 text-sm text-[#1A4349]/80"
								>
									<Check className="mt-0.5 h-4 w-4 shrink-0 text-[#41A3AD]" />
									<span>{t(featureKey)}</span>
								</li>
							))}
						</ul>

						<Link
							href="#apply"
							className={`mt-auto inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
								item.popular
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "border-2 border-[#D4E8EA] bg-white text-[#02474F] hover:bg-[#F2FEFF]"
							}`}
						>
							{t(item.ctaKey)}
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
