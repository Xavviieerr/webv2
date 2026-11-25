"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconAlertTriangle,
	IconArrowLeft,
	IconBook2,
	IconLoader2,
} from "@tabler/icons-react";
import { useGetMyFolktaleQuery } from "../api/folktaleEndpoints";
import type { FolktaleDetail } from "../types/folktales";
import { FolktaleAccessGate } from "./FolktaleAccessGate";
import { FolktaleDetailAside } from "./FolktaleDetailAside";
import { FolktaleDetailHeader } from "./FolktaleDetailHeader";
import { FolktaleOwnerActions } from "./FolktaleOwnerActions";
import { FolktaleSceneRenderer } from "./FolktaleSceneRenderer";

const LIST_HREF = "/guonopedia/contribute/folktales";

interface FolktaleDetailViewProps {
	folktaleId: string;
}

export function FolktaleDetailView({ folktaleId }: FolktaleDetailViewProps) {
	const { t } = useTranslation("common");
	const { data, isLoading, isError, error, refetch } =
		useGetMyFolktaleQuery(folktaleId);

	const errorStatus =
		typeof error === "object" && error && "status" in error
			? (error as { status?: number }).status
			: undefined;
	const isNotFound = isError && errorStatus === 404;

	return (
		<FolktaleAccessGate>
			<main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				<Link
					href={LIST_HREF}
					className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
				>
					<IconArrowLeft className="h-4 w-4" />
					{t("backToMyFolktales")}
				</Link>

				{isLoading && (
					<div className="flex items-center gap-2 py-16 text-sm text-gray-500">
						<IconLoader2 className="h-5 w-5 animate-spin" />
						{t("loading")}
					</div>
				)}

				{!isLoading && isError && !isNotFound && (
					<div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
						<p>{t("loadFolktalesFailed")}</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="rounded-lg bg-[#0D4D4D] px-4 py-2 text-xs font-semibold text-white"
						>
							{t("tryAgain")}
						</button>
					</div>
				)}

				{!isLoading && (isNotFound || (!isError && !data)) && (
					<section className="flex flex-col items-start gap-4 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6 sm:p-8">
						<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
							<IconBook2 className="h-5 w-5" />
						</span>
						<div className="flex flex-col gap-1.5">
							<h1 className="text-xl font-semibold text-[#0D4D4D]">
								{t("folktaleNotFoundTitle")}
							</h1>
							<p className="max-w-xl text-sm leading-relaxed text-gray-600">
								{t("folktaleNotFoundDescription")}
							</p>
						</div>
						<Link
							href={LIST_HREF}
							className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							{t("backToMyFolktales")}
						</Link>
					</section>
				)}

				{!isLoading && !isError && data && (
					<FolktaleDetailContent folktale={data} />
				)}
			</main>
		</FolktaleAccessGate>
	);
}

function FolktaleDetailContent({ folktale }: { folktale: FolktaleDetail }) {
	const { t } = useTranslation("common");
	const isRejected = folktale.status === "rejected";
	const hasAside =
		Boolean(folktale.region || folktale.collectedYear || folktale.moral) ||
		(folktale.tags?.length ?? 0) > 0 ||
		Boolean(
			folktale.audioUrl ||
				folktale.narratorName ||
				folktale.narratorBio ||
				folktale.storytellerName ||
				folktale.storytellerBio ||
				folktale.sourceNote,
		) ||
		(folktale.characters?.length ?? 0) > 0 ||
		(folktale.glossary?.length ?? 0) > 0;

	return (
		<>
			<FolktaleDetailHeader folktale={folktale} />

			<FolktaleOwnerActions folktale={folktale} />

			{isRejected && folktale.rejectionReason && (
				<section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
					<IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
					<div className="flex flex-col gap-1">
						<h2 className="font-semibold">{t("reviewerNote")}</h2>
						<p className="break-words leading-relaxed [overflow-wrap:anywhere]">{folktale.rejectionReason}</p>
					</div>
				</section>
			)}

			<div
				className={
					hasAside
						? "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
						: "grid grid-cols-1 gap-6"
				}
			>
				<section className="flex flex-col gap-4 rounded-2xl border border-[#0D4D4D]/10 bg-white p-5 sm:p-7">
					<h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#0D4D4D]/60">
						{t("storyLabel")}
					</h2>
					<FolktaleSceneRenderer
						body={folktale.body}
						illustrations={folktale.illustrations}
					/>
				</section>

				<FolktaleDetailAside folktale={folktale} />
			</div>
		</>
	);
}
