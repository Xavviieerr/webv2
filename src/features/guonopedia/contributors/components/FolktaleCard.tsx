"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconAlertTriangle,
	IconArrowRight,
	IconBook2,
	IconClock,
} from "@tabler/icons-react";
import { getFolktaleTypeLabelKey } from "../constants/folktales";
import { formatFolktaleDate } from "../utils/formatFolktaleDate";
import type { FolktaleListItem } from "../types/folktales";
import { FolktaleStatusBadge } from "./FolktaleStatusBadge";

interface FolktaleCardProps {
	folktale: FolktaleListItem;
}

export function FolktaleCard({ folktale }: FolktaleCardProps) {
	const { t } = useTranslation("common");
	const updatedAt = folktale.updatedAt || folktale.createdAt;
	const isRejected = folktale.status === "rejected";

	return (
		<Link
			href={`/guonopedia/contribute/folktales/${folktale.id}`}
			className="group flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] transition-all hover:-translate-y-0.5 hover:border-[#0D4D4D]/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D4D4D] focus-visible:ring-offset-2"
		>
			<div className="relative h-36 w-full overflow-hidden bg-[#0D4D4D]/8">
				{folktale.coverImage ? (
					<img
						src={folktale.coverImage}
						alt=""
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#F2FEFF_0%,#D4E8EA_55%,#C3DEE1_100%)]">
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#0D4D4D]">
							<IconBook2 className="h-6 w-6" />
						</span>
					</div>
				)}
				<div className="absolute left-3 top-3">
					<FolktaleStatusBadge status={folktale.status} />
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-3 p-5">
				<div className="flex flex-col gap-2">
					<span className="w-fit rounded-full border border-[#0D4D4D]/15 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#0D4D4D]">
						{t(getFolktaleTypeLabelKey(folktale.type))}
					</span>
					<h3 className="line-clamp-2 break-words text-base font-semibold leading-snug text-[#0D4D4D] group-hover:underline group-hover:underline-offset-4 [overflow-wrap:anywhere]">
						{folktale.title}
					</h3>
					<p className="line-clamp-2 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
						{folktale.summary}
					</p>
				</div>

				{isRejected && folktale.rejectionReason && (
					<div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
						<IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
						<span className="min-w-0">
							<span className="block font-semibold">
								{t("reviewerNote")}
							</span>
							<span className="line-clamp-2">
								{folktale.rejectionReason}
							</span>
						</span>
					</div>
				)}

				<div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-500">
					{folktale.readingTimeMinutes > 0 && (
						<span className="inline-flex items-center gap-1.5">
							<IconClock className="h-3.5 w-3.5" />
							{t("folktaleReadingTime", {
								count: folktale.readingTimeMinutes,
							})}
						</span>
					)}
					{formatFolktaleDate(updatedAt) && (
						<span>
							{t("updatedOnDate", {
								date: formatFolktaleDate(updatedAt),
							})}
						</span>
					)}
				</div>

				<span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D4D4D]">
					{t("viewFolktale")}
					<IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				</span>
			</div>
		</Link>
	);
}
