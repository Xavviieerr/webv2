"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
	getStatusLabelKey,
	getStatusTone,
} from "../utils/scopes";
import type { ContributorStatus } from "../types";

interface StatusBadgeProps {
	status?: ContributorStatus | string;
	className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const { t } = useTranslation("common");
	const tone = getStatusTone(status);

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
				tone.badge,
				className,
			)}
		>
			<span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
			{t(getStatusLabelKey(status))}
		</span>
	);
}
