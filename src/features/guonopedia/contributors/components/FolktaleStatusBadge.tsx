"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
	getFolktaleStatusLabelKey,
	getFolktaleStatusTone,
} from "../constants/folktales";

interface FolktaleStatusBadgeProps {
	status?: string;
	className?: string;
}

export function FolktaleStatusBadge({
	status,
	className,
}: FolktaleStatusBadgeProps) {
	const { t } = useTranslation("common");
	const tone = getFolktaleStatusTone(status);

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
				tone.badge,
				className,
			)}
		>
			<span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
			{t(getFolktaleStatusLabelKey(status))}
		</span>
	);
}
