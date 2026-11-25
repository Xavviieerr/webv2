"use client";

import { useTranslation } from "react-i18next";
import {
	IconBook2,
	IconClock,
	IconEye,
	IconMapPin,
	IconPlayerPlay,
} from "@tabler/icons-react";
import { getFolktaleTypeLabelKey } from "../constants/folktales";
import { formatFolktaleDate } from "../utils/formatFolktaleDate";
import type { FolktaleDetail } from "../types/folktales";
import { FolktaleStatusBadge } from "./FolktaleStatusBadge";

export function FolktaleDetailHeader({ folktale }: { folktale: FolktaleDetail }) {
	const { t } = useTranslation("common");
	const updatedAt = folktale.updatedAt || folktale.createdAt;
	const submittedAt = folktale.createdAt;

	return (
		<header className="overflow-hidden rounded-3xl bg-[#D4E8EA]">
			<div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px]">
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2">
						<FolktaleStatusBadge status={folktale.status} />
						<span className="rounded-full border border-[#0D4D4D]/15 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#0D4D4D]">
							{t(getFolktaleTypeLabelKey(folktale.type))}
						</span>
						{folktale.region && (
							<span className="inline-flex items-center gap-1 rounded-full border border-[#0D4D4D]/10 bg-white/50 px-2.5 py-1 text-[11px] font-medium text-[#0D4D4D]/70">
								<IconMapPin className="h-3 w-3" />
								{folktale.region}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<h1 className="break-words text-3xl font-semibold leading-tight text-[#0D4D4D] [overflow-wrap:anywhere] sm:text-4xl">
							{folktale.title}
						</h1>
						{folktale.localTitle && (
							<p className="break-words text-base italic text-[#0D4D4D]/70 [overflow-wrap:anywhere]">
								{folktale.localTitle}
							</p>
						)}
					</div>

					<p className="max-w-2xl break-words text-sm leading-relaxed text-gray-700 [overflow-wrap:anywhere] sm:text-base">
						{folktale.summary}
					</p>

					{(folktale.readingTimeMinutes > 0 ||
						typeof folktale.viewCount === "number" ||
						typeof folktale.playCount === "number") && (
						<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#0D4D4D]/70">
							{folktale.readingTimeMinutes > 0 && (
								<span className="inline-flex items-center gap-1.5">
									<IconClock className="h-4 w-4" />
									{t("folktaleReadingTime", {
										count: folktale.readingTimeMinutes,
									})}
								</span>
							)}
							{typeof folktale.viewCount === "number" && (
								<span className="inline-flex items-center gap-1.5">
									<IconEye className="h-4 w-4" />
									{t("viewsCount", {
										count: folktale.viewCount,
									})}
								</span>
							)}
							{typeof folktale.playCount === "number" && (
								<span className="inline-flex items-center gap-1.5">
									<IconPlayerPlay className="h-4 w-4" />
									{t("playsCount", {
										count: folktale.playCount,
									})}
								</span>
							)}
						</div>
					)}

					<div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#0D4D4D]/60">
						{formatFolktaleDate(submittedAt) && (
							<span>
								{t("submittedOnDate", {
									date: formatFolktaleDate(submittedAt),
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
				</div>

				<div className="relative min-h-[180px] overflow-hidden rounded-2xl bg-white/50">
					{folktale.coverImage ? (
						<img
							src={folktale.coverImage}
							alt=""
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#FFFFFF_0%,#F2FEFF_55%,#D4E8EA_100%)] p-5 text-center">
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
								<IconBook2 className="h-5 w-5" />
							</span>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
