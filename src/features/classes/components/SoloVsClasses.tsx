"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, X } from "lucide-react";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function SoloVsClasses() {
	const { t } = useTranslation("common");

	const appPoints = [
		t("compareAppPoint1"),
		t("compareAppPoint2"),
		t("compareAppPoint3"),
		t("compareAppPoint4"),
	];
	const classPoints = [
		t("compareClassesPoint1"),
		t("compareClassesPoint2"),
		t("compareClassesPoint3"),
		t("compareClassesPoint4"),
		t("compareClassesPoint5"),
	];

	return (
		<ClassesSection tone="white">
			<div className="flex flex-col gap-10">
				<SectionHeading
					align="center"
					eyebrow={t("compareEyebrow")}
					title={t("compareTitle")}
					description={t("compareDescription")}
					className="mx-auto max-w-3xl"
				/>

				<div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
					<div className="order-2 flex flex-col gap-4 rounded-3xl border border-[#D4E8EA] bg-[#F2FEFF] p-6 md:order-1 lg:p-8">
						<span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1A4349]/60">
							{t("compareAppTitle")}
						</span>
						<div className="flex flex-col gap-1">
							<h3 className="text-xl font-semibold text-[#1A4349]/80 sm:text-2xl">
								{t("compareAppSubtitle")}
							</h3>
						</div>
						<ul className="mt-2 flex flex-col gap-3">
							{appPoints.map((point) => (
								<li
									key={point}
									className="flex items-start gap-2.5 text-sm text-[#1A4349]/60"
								>
									<X className="mt-0.5 h-4 w-4 shrink-0 text-[#1A4349]/35" />
									{point}
								</li>
							))}
						</ul>
					</div>

					<div className="order-1 flex flex-col gap-4 rounded-3xl bg-[#02474F] p-6 text-white shadow-[0_30px_70px_-45px_rgba(2,71,79,0.9)] md:order-2 lg:p-8">
						<span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#02474F]">
							{t("compareClassesTitle")}
						</span>
						<h3 className="text-xl font-semibold sm:text-2xl">
							{t("compareClassesSubtitle")}
						</h3>
						<ul className="mt-2 flex flex-col gap-3">
							{classPoints.map((point) => (
								<li
									key={point}
									className="flex items-start gap-2.5 text-sm text-white/85"
								>
									<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#41A3AD] text-[#02474F]">
										<Check className="h-2.5 w-2.5" />
									</span>
									{point}
								</li>
							))}
						</ul>
						<Link
							href="#apply"
							className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#02474F] transition-colors hover:bg-[#FBF5EA]"
						>
							{t("compareCta")}
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</ClassesSection>
	);
}
