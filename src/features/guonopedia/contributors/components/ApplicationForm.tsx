"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
	IconArrowLeft,
	IconArrowRight,
	IconCheck,
	IconLoader2,
	IconUserPlus,
} from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import { cn } from "@/lib/utils";
import {
	useApplyAsContributorMutation,
	useGetContributorScopesQuery,
} from "../api/contributorEndpoints";
import { SCOPE_DEFINITIONS } from "../constants/scopes";
import { contributorApplicationSchema } from "../schemas/applicationSchema";
import {
	buildScopeStatusMap,
	isContributorStatus,
} from "../utils/scopes";
import {
	CONTRIBUTOR_SCOPES,
	type ApplyContributorResponse,
	type ContributorScope,
	type ContributorScopeRecord,
} from "../types";
import { StatusBadge } from "./StatusBadge";

const EMPTY_RECORDS: ContributorScopeRecord[] = [];
const APPLY_PATH = "/guonopedia/contribute/apply";

function isLockedStatus(status: string | undefined): boolean {
	return (
		status === "pending" ||
		status === "approved" ||
		status === "suspended"
	);
}

export function ApplicationForm() {
	const { t } = useTranslation("common");
	const user = useAppSelector((state) => state.auth.user);

	const { data, isLoading: isLoadingScopes } = useGetContributorScopesQuery(
		user?.id ?? "",
		{ skip: !user?.id },
	);
	const [applyAsContributor, { isLoading: isSubmitting }] =
		useApplyAsContributorMutation();

	const records = data ?? EMPTY_RECORDS;
	const statusMap = useMemo(
		() => buildScopeStatusMap(records),
		[records],
	);

	const [selected, setSelected] = useState<ContributorScope[]>([]);
	const [expertise, setExpertise] = useState("");
	const [applicationNote, setApplicationNote] = useState("");
	const [agree, setAgree] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [result, setResult] = useState<ApplyContributorResponse | null>(null);

	// Preselect a scope when the user arrives from a scope card.
	useEffect(() => {
		const queryScope = new URLSearchParams(window.location.search).get(
			"scope",
		);
		if (queryScope && (CONTRIBUTOR_SCOPES as readonly string[]).includes(queryScope)) {
			setSelected([queryScope as ContributorScope]);
		}
	}, []);

	// Never keep a scope selected once it has an active application.
	useEffect(() => {
		setSelected((current) =>
			current.filter(
				(scope) => !isLockedStatus(statusMap[scope]?.status),
			),
		);
	}, [statusMap]);

	const toggleScope = (scope: ContributorScope) => {
		if (isLockedStatus(statusMap[scope]?.status)) return;
		setSelected((current) =>
			current.includes(scope)
				? current.filter((item) => item !== scope)
				: [...current, scope],
		);
		if (errors.scopes) {
			setErrors((current) => {
				const next = { ...current };
				delete next.scopes;
				return next;
			});
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrors({});

		const parsed = contributorApplicationSchema.safeParse({
			scopes: selected,
			applicationNote: applicationNote.trim() || undefined,
			expertise: expertise.trim() || undefined,
			agree,
		});

		if (!parsed.success) {
			const fieldErrors: Record<string, string> = {};
			parsed.error.issues.forEach((issue) => {
				fieldErrors[String(issue.path[0])] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		try {
			const response = await applyAsContributor({
				scopes: parsed.data.scopes,
				applicationNote: parsed.data.applicationNote,
				expertise: parsed.data.expertise,
			}).unwrap();

			setResult(response);
			if (response.data.applied.length > 0) {
				toast.success(t("applicationSubmitted"));
			}
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error: unknown) {
			const message = (
				error as { data?: { message?: string | string[] } }
			)?.data?.message;
			const readable = Array.isArray(message) ? message[0] : message;
			toast.error(readable ?? t("applicationFailed"));
			setErrors({ submit: "applicationFailed" });
		}
	};

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			{user && (
				<Link
					href="/guonopedia/contribute"
					className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
				>
					<IconArrowLeft className="h-4 w-4" />
					{t("backToContributorHub")}
				</Link>
			)}

			<header className="flex flex-col gap-3">
				<h1 className="text-3xl font-semibold text-[#0D4D4D] sm:text-4xl">
					{t("applyToBeContributor")}
				</h1>
				<p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
					{t("contributorProgramDescription")}
				</p>
			</header>

			{!user && (
				<section className="overflow-hidden rounded-3xl border border-[#0D4D4D]/10 bg-[#D4E8EA]">
					<div className="flex flex-col gap-5 p-6 sm:p-8">
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0D4D4D]">
							<IconUserPlus className="h-6 w-6" />
						</span>

						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold text-[#0D4D4D]">
								{t("signInToApply")}
							</h2>
							<p className="max-w-2xl text-sm leading-relaxed text-gray-600">
								{t("contributorGateDescription")}
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link
								href={`/signin?next=${encodeURIComponent(APPLY_PATH)}`}
								className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
							>
								{t("login")}
								<IconArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="/signup"
								className="inline-flex items-center justify-center rounded-full border border-[#0D4D4D]/20 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40 hover:bg-[#F2FEFF]"
							>
								{t("createAccount")}
							</Link>
						</div>

						<p className="text-xs text-gray-500">
							{t("contributorGateNote")}
						</p>
					</div>

					<div className="border-t border-[#0D4D4D]/10 bg-[#F2FEFF] p-6 sm:p-8">
						<h3 className="text-base font-semibold text-[#0D4D4D]">
							{t("chooseScopes")}
						</h3>
						<p className="mt-1 text-sm text-gray-600">
							{t("chooseScopesDescription")}
						</p>

						<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
							{SCOPE_DEFINITIONS.filter((definition) => definition.available).map(
								(definition) => {
									const Icon = definition.icon;
									return (
										<div
											key={definition.value}
											className="flex items-start gap-3 rounded-xl border border-[#0D4D4D]/10 bg-white p-3"
										>
											<span
												className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
												style={{
													backgroundColor: `${definition.color}1A`,
													color: definition.color,
												}}
											>
												<Icon className="h-4 w-4" />
											</span>
											<div className="min-w-0">
												<p className="text-sm font-semibold text-[#0D4D4D]">
													{t(definition.labelKey)}
												</p>
												<p className="text-xs leading-relaxed text-gray-600">
													{t(definition.descriptionKey)}
												</p>
											</div>
										</div>
									);
								},
							)}
						</div>
					</div>
				</section>
			)}

			{user && isLoadingScopes && (
				<div className="flex items-center gap-2 py-10 text-sm text-gray-500">
					<IconLoader2 className="h-5 w-5 animate-spin" />
					{t("loading")}
				</div>
			)}

			{user && !isLoadingScopes && result && (
				<ApplicationResult result={result} />
			)}

			{user && !isLoadingScopes && !result && (
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-7 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-5 sm:p-7"
				>
					<section className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<h2 className="text-lg font-semibold text-[#0D4D4D]">
								{t("chooseScopes")}
							</h2>
							<p className="text-sm text-gray-600">
								{t("chooseScopesDescription")}
							</p>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{SCOPE_DEFINITIONS.map((definition) => {
								const Icon = definition.icon;
								const record = statusMap[definition.value];
								const locked = isLockedStatus(record?.status);
								const isSelected = selected.includes(definition.value);

								return (
									<button
										key={definition.value}
										type="button"
										aria-pressed={isSelected}
										disabled={locked}
										onClick={() => toggleScope(definition.value)}
										className={cn(
											"flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
											locked
												? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-80"
												: isSelected
													? "border-[#0D4D4D] bg-white"
													: "border-[#0D4D4D]/15 bg-white/60 hover:border-[#0D4D4D]/40 hover:bg-white",
										)}
									>
										<span
											className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
											style={{ backgroundColor: definition.color }}
										>
											<Icon className="h-4 w-4 text-white" />
										</span>
										<span className="flex min-w-0 flex-1 flex-col gap-1">
											<span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#0D4D4D]">
												{t(definition.labelKey)}
												{locked && record && (
													<StatusBadge status={record.status} />
												)}
											</span>
											<span className="text-xs leading-relaxed text-gray-600">
												{t(definition.descriptionKey)}
											</span>
										</span>
										{isSelected && !locked && (
											<IconCheck className="mt-1 h-4 w-4 shrink-0 text-[#0D4D4D]" />
										)}
									</button>
								);
							})}
						</div>

						{errors.scopes && (
							<p className="text-xs font-medium text-red-600">
								{t(errors.scopes)}
							</p>
						)}
					</section>

					<section className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="contributor-expertise"
								className="text-sm font-semibold text-[#0D4D4D]"
							>
								{t("expertiseLabel")}{" "}
								<span className="font-normal text-gray-400">
									({t("optional")})
								</span>
							</label>
							<input
								id="contributor-expertise"
								value={expertise}
								onChange={(event) => setExpertise(event.target.value)}
								placeholder={t("expertisePlaceholder")}
								className="w-full rounded-lg border border-[#0D4D4D]/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0D4D4D]"
							/>
							{errors.expertise && (
								<p className="text-xs text-red-600">{t(errors.expertise)}</p>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="contributor-note"
								className="text-sm font-semibold text-[#0D4D4D]"
							>
								{t("applicationNoteLabel")}{" "}
								<span className="font-normal text-gray-400">
									({t("optional")})
								</span>
							</label>
							<textarea
								id="contributor-note"
								rows={4}
								value={applicationNote}
								onChange={(event) =>
									setApplicationNote(event.target.value)
								}
								placeholder={t("applicationNotePlaceholder")}
								className="w-full resize-y rounded-lg border border-[#0D4D4D]/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0D4D4D]"
							/>
							{errors.applicationNote && (
								<p className="text-xs text-red-600">
									{t(errors.applicationNote)}
								</p>
							)}
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
							<input
								type="checkbox"
								checked={agree}
								onChange={(event) => {
									setAgree(event.target.checked);
									if (errors.agree) {
										setErrors((current) => {
											const next = { ...current };
											delete next.agree;
											return next;
										});
									}
								}}
								className="mt-0.5 h-4 w-4 accent-[#0D4D4D]"
							/>
							<span>{t("agreeContributorTerms")}</span>
						</label>
						{errors.agree && (
							<p className="text-xs font-medium text-red-600">
								{t(errors.agree)}
							</p>
						)}
					</section>

					{errors.submit && (
						<p className="text-sm font-medium text-red-600">
							{t(errors.submit)}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D4D4D] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{isSubmitting ? (
							<>
								<IconLoader2 className="h-4 w-4 animate-spin" />
								{t("submitting")}
							</>
						) : (
							<>
								{t("submitApplication")}
								<IconArrowRight className="h-4 w-4" />
							</>
						)}
					</button>
				</form>
			)}
		</main>
	);
}

function ApplicationResult({ result }: { result: ApplyContributorResponse }) {
	const { t } = useTranslation("common");
	const applied = result.data.applied;
	const skipped = result.data.skipped;
	const hasApplied = applied.length > 0;

	return (
		<section className="flex flex-col gap-5 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6 sm:p-8">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[#0D4D4D]">
					{hasApplied
						? t("applicationSubmitted")
						: t("applicationSkippedTitle")}
				</h2>
				<p className="max-w-2xl text-sm leading-relaxed text-gray-600">
					{hasApplied
						? t("applicationSubmittedDescription")
						: t("applicationSkippedDescription")}
				</p>
			</div>

			{applied.length > 0 && (
				<div className="flex flex-col gap-2">
					{applied.map((record) => {
						const definition = SCOPE_DEFINITIONS.find(
							(item) => item.value === record.scope,
						);
						return (
							<div
								key={record.id}
								className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#0D4D4D]/10 px-4 py-3"
							>
								<span className="text-sm font-semibold text-[#0D4D4D]">
									{definition
										? t(definition.labelKey)
										: String(record.scope)}
								</span>
								<StatusBadge
									status={
										isContributorStatus(String(record.status))
											? record.status
											: undefined
									}
								/>
							</div>
						);
					})}
				</div>
			)}

			{skipped.length > 0 && (
				<div className="flex flex-col gap-2">
					<h3 className="text-sm font-semibold text-[#0D4D4D]">
						{t("applicationSkippedTitle")}
					</h3>
					{skipped.map((item) => {
						const definition = SCOPE_DEFINITIONS.find(
							(entry) => entry.value === item.scope,
						);
						return (
							<div
								key={`${item.scope}-${item.reason}`}
								className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
							>
								<span className="font-semibold">
									{definition
										? t(definition.labelKey)
										: item.scope}
								</span>
								<span className="block text-xs text-amber-800">
									{item.reason}
								</span>
							</div>
						);
					})}
				</div>
			)}

			<div className="flex flex-wrap gap-3">
				<Link
					href="/guonopedia/contribute"
					className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					{t("backToContributorHub")}
					<IconArrowRight className="h-4 w-4" />
				</Link>
				<Link
					href={APPLY_PATH}
					className="inline-flex items-center gap-2 rounded-full border border-[#0D4D4D]/30 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]"
				>
					{t("applyForThisScope")}
				</Link>
			</div>
		</section>
	);
}
