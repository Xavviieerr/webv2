"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { IconArrowLeft, IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import { useAppSelector } from "@/types/hooks";
import {
	useApplyAsContributorMutation,
	useGetContributorScopesQuery,
} from "../api/contributorEndpoints";
import {
	SCOPE_DEFINITIONS,
	isScopeContributionAvailable,
} from "../constants/scopes";
import { contributorApplicationSchema } from "../schemas/applicationSchema";
import {
	buildScopeStatusMap,
	isLockedContributorStatus,
} from "../utils/scopes";
import {
	type ApplyContributorResponse,
	type ContributorScope,
	type ContributorScopeRecord,
} from "../types";
import { ApplicationAgreement } from "./applicationForm/ApplicationAgreement";
import { ApplicationDetailsFields } from "./applicationForm/ApplicationDetailsFields";
import { ApplicationResult } from "./applicationForm/ApplicationResult";
import { ApplicationScopeSelector } from "./applicationForm/ApplicationScopeSelector";
import { SignedOutApplicationGate } from "./applicationForm/SignedOutApplicationGate";

const EMPTY_RECORDS: ContributorScopeRecord[] = [];

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

	// Preselect a scope when the user arrives from a scope card. Unavailable
	// scopes are ignored so a crafted URL cannot select them.
	useEffect(() => {
		const queryScope = new URLSearchParams(window.location.search).get(
			"scope",
		);
		if (!queryScope) return;
		const definition = SCOPE_DEFINITIONS.find(
			(item) => item.value === queryScope,
		);
		if (definition && isScopeContributionAvailable(definition)) {
			setSelected([definition.value]);
		}
	}, []);

	// Never keep a scope selected once it has an active application.
	useEffect(() => {
		setSelected((current) =>
			current.filter(
				(scope) =>
					!isLockedContributorStatus(statusMap[scope]?.status),
			),
		);
	}, [statusMap]);

	const clearError = (key: string) => {
		setErrors((current) => {
			if (!current[key]) return current;
			const next = { ...current };
			delete next[key];
			return next;
		});
	};

	const toggleScope = (scope: ContributorScope) => {
		if (isLockedContributorStatus(statusMap[scope]?.status)) return;
		setSelected((current) =>
			current.includes(scope)
				? current.filter((item) => item !== scope)
				: [...current, scope],
		);
		clearError("scopes");
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

			{!user && <SignedOutApplicationGate />}

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
					<ApplicationScopeSelector
						selected={selected}
						statusMap={statusMap}
						error={errors.scopes}
						onToggle={toggleScope}
					/>

					<ApplicationDetailsFields
						expertise={expertise}
						applicationNote={applicationNote}
						errors={errors}
						onExpertiseChange={(value) => {
							setExpertise(value);
							clearError("expertise");
						}}
						onApplicationNoteChange={(value) => {
							setApplicationNote(value);
							clearError("applicationNote");
						}}
					/>

					<ApplicationAgreement
						agree={agree}
						error={errors.agree}
						onChange={(checked) => {
							setAgree(checked);
							clearError("agree");
						}}
					/>

					{errors.submit && (
						<p className="text-sm font-medium text-red-600">
							{t(errors.submit)}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting || !agree}
						className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D4D4D] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
