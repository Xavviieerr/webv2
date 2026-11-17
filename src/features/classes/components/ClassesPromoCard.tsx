"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassesPromoCardProps {
	descriptionKey?: string;
	className?: string;
}

/**
 * Compact entry point to the Urhobo classes page. Used on the public landing
 * page and on the dashboard home.
 */
export function ClassesPromoCard({
	descriptionKey = "classesCardDescription",
	className,
}: ClassesPromoCardProps) {
	const { t } = useTranslation("common");

	return (
		<Link
			href="/classes"
			className={cn(
				"group flex flex-col gap-3 rounded-2xl border border-[#D4E8EA] bg-[#D4E8EA] p-5 transition-all hover:-translate-y-0.5 hover:border-[#41A3AD] hover:shadow-md",
				className,
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#02474F] text-white">
					<GraduationCap className="h-5 w-5" />
				</span>
				<span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#02474F]">
					{t("personalClasses")}
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<h3 className="text-base font-semibold text-[#02474F]">
					{t("classesCardTitle")}
				</h3>
				<p className="text-sm leading-relaxed text-[#1A4349]/80">
					{t(descriptionKey)}
				</p>
			</div>

			<span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#02474F]">
				{t("exploreClasses")}
				<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
			</span>
		</Link>
	);
}
