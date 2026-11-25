"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconArrowLeft,
	IconBook2,
	IconChevronLeft,
	IconChevronRight,
	IconPlus,
	IconSearch,
} from "@tabler/icons-react";
import { useGetMyFolktalesQuery } from "../api/folktaleEndpoints";
import {
	FOLKTALE_PAGE_SIZE,
	FOLKTALE_STATUS_OPTIONS,
	FOLKTALE_TYPE_OPTIONS,
} from "../constants/folktales";
import { FolktaleCard } from "./FolktaleCard";
import { FolktaleAccessGate } from "./FolktaleAccessGate";
import { FolktaleSelect } from "./folktaleForm/fields";

const ALL_FILTER_VALUE = "all";

export function FolktalesWorkspace() {
	const { t } = useTranslation("common");
	const [page, setPage] = useState(1);
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");

	const query = useMemo(
		() => ({
			page,
			limit: FOLKTALE_PAGE_SIZE,
			type: type || undefined,
			status: status || undefined,
		}),
		[page, type, status],
	);

	const { data, isLoading, isFetching, isError, refetch } =
		useGetMyFolktalesQuery(query);

	const total = data?.total ?? 0;
	const limit = data?.limit ?? FOLKTALE_PAGE_SIZE;
	const currentPage = data?.page ?? page;
	const totalPages = data?.totalPages ?? 0;
	const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
	const to = Math.min(currentPage * limit, total);
	const hasFilters = Boolean(type || status);
	const showInitialLoading = isLoading && !data;

	const typeOptions = useMemo(
		() => [
			{
				value: ALL_FILTER_VALUE,
				label: t("folktaleFilterAllTypes"),
			},
			...FOLKTALE_TYPE_OPTIONS.map((option) => ({
				value: option.value,
				label: t(option.labelKey),
			})),
		],
		[t],
	);

	const statusOptions = useMemo(
		() => [
			{
				value: ALL_FILTER_VALUE,
				label: t("folktaleFilterAllStatuses"),
			},
			...FOLKTALE_STATUS_OPTIONS.map((option) => ({
				value: option.value,
				label: t(option.labelKey),
			})),
		],
		[t],
	);

	const resetPage = () => setPage(1);

	const clearFilters = () => {
		setType("");
		setStatus("");
		setPage(1);
	};

	return (
		<FolktaleAccessGate>
			<main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				<Link
					href="/guonopedia/contribute"
					className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
				>
					<IconArrowLeft className="h-4 w-4" />
					{t("backToContributorHub")}
				</Link>

				<header className="relative overflow-hidden rounded-3xl bg-[#D4E8EA] p-6 sm:p-8">
					<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
									<IconBook2 className="h-6 w-6" />
								</span>
								<div>
									<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D4D4D]/60">
										{t("folktales")}
									</p>
									<h1 className="text-2xl font-semibold text-[#0D4D4D] sm:text-3xl">
										{t("myFolktalesTitle")}
									</h1>
								</div>
							</div>
							<p className="max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
								{t("myFolktalesDescription")}
							</p>
						</div>

						<Link
							href="/guonopedia/contribute/folktales/new"
							className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							<IconPlus className="h-4 w-4" />
							{t("contributeFolktale")}
						</Link>
					</div>
					<div
						aria-hidden
						className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/40"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-[#0D4D4D]/10"
					/>
				</header>

				<section className="flex flex-col gap-4 rounded-2xl border border-[#0D4D4D]/10 bg-white p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
					<div className="grid w-full grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]/70">
								{t("folktaleFilterType")}
							</span>
							<FolktaleSelect
								id="folktale-filter-type"
								value={type || ALL_FILTER_VALUE}
								placeholder={t("folktaleFilterAllTypes")}
								options={typeOptions}
								onChange={(nextValue) => {
									setType(
										nextValue === ALL_FILTER_VALUE
											? ""
											: nextValue,
									);
									resetPage();
								}}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]/70">
								{t("folktaleFilterStatus")}
							</span>
							<FolktaleSelect
								id="folktale-filter-status"
								value={status || ALL_FILTER_VALUE}
								placeholder={t("folktaleFilterAllStatuses")}
								options={statusOptions}
								onChange={(nextValue) => {
									setStatus(
										nextValue === ALL_FILTER_VALUE
											? ""
											: nextValue,
									);
									resetPage();
								}}
							/>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{total > 0 && (
							<span className="text-xs text-gray-500">
								{t("folktalesShowing", { from, to, total })}
							</span>
						)}
						{hasFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D4D]/20 px-3.5 py-2 text-xs font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40 hover:bg-[#F2FEFF]"
							>
								{t("clearFilters")}
							</button>
						)}
					</div>
				</section>

				{showInitialLoading && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="h-[320px] animate-pulse rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA]/60"
							/>
						))}
					</div>
				)}

				{!showInitialLoading && isError && (
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

				{!showInitialLoading && !isError && total === 0 && (
					<EmptyState
						title={
							hasFilters
								? t("noFolktalesMatchTitle")
								: t("noFolktalesYetTitle")
						}
						description={
							hasFilters
								? t("noFolktalesMatchDescription")
								: t("noFolktalesYetDescription")
						}
						action={
							hasFilters ? (
								<button
									type="button"
									onClick={clearFilters}
									className="inline-flex items-center gap-2 rounded-full border border-[#0D4D4D]/25 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:bg-[#F2FEFF]"
								>
									{t("clearFilters")}
								</button>
							) : (
								<Link
									href="/guonopedia/contribute/folktales/new"
									className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								>
									<IconPlus className="h-4 w-4" />
									{t("contributeFolktale")}
								</Link>
							)
						}
					/>
				)}

				{!showInitialLoading && !isError && total > 0 && (
					<>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{(data?.items ?? []).map((folktale) => (
								<FolktaleCard
									key={folktale.id}
									folktale={folktale}
								/>
							))}
						</div>

						{totalPages > 1 && (
							<nav
								aria-label={t("myFolktalesTitle")}
								className="flex flex-wrap items-center justify-center gap-3 py-4"
							>
								<button
									type="button"
									onClick={() =>
										setPage((current) =>
											Math.max(1, current - 1),
										)
									}
									disabled={currentPage <= 1 || isFetching}
									className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D4D]/15 bg-white px-4 py-2 text-sm font-medium text-[#0D4D4D] transition-colors hover:bg-[#F2FEFF] disabled:cursor-not-allowed disabled:opacity-40"
								>
									<IconChevronLeft className="h-4 w-4" />
									{t("previousPage")}
								</button>
								<span className="text-sm text-[#0D4D4D]/70">
									{t("pageOfPages", {
										page: currentPage,
										totalPages,
									})}
								</span>
								<button
									type="button"
									onClick={() =>
										setPage((current) =>
											Math.min(totalPages, current + 1),
										)
									}
									disabled={
										currentPage >= totalPages || isFetching
									}
									className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D4D]/15 bg-white px-4 py-2 text-sm font-medium text-[#0D4D4D] transition-colors hover:bg-[#F2FEFF] disabled:cursor-not-allowed disabled:opacity-40"
								>
									{t("nextPage")}
									<IconChevronRight className="h-4 w-4" />
								</button>
							</nav>
						)}
					</>
				)}
			</main>
		</FolktaleAccessGate>
	);
}

function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-start gap-4 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6 sm:p-8">
			<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
				<IconSearch className="h-5 w-5" />
			</span>
			<div className="flex flex-col gap-1.5">
				<h2 className="text-lg font-semibold text-[#0D4D4D]">{title}</h2>
				<p className="max-w-xl text-sm leading-relaxed text-gray-600">
					{description}
				</p>
			</div>
			{action}
		</section>
	);
}
