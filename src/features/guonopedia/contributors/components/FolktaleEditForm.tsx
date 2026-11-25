"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import { useGetMyFolktaleQuery } from "../api/folktaleEndpoints";
import {
	formStateFromFolktale,
	selectedTermsFromFolktale,
	REVIEW_STEP,
} from "../folktaleForm/types";
import { useFolktaleDraft } from "../folktaleForm/useFolktaleDraft";
import { useFolktaleEditor } from "../folktaleForm/useFolktaleEditor";
import type { FolktaleDetail } from "../types/folktales";
import { FolktaleAccessGate } from "./FolktaleAccessGate";
import { FolktaleFormShell } from "./folktaleForm/FolktaleFormShell";

const LIST_HREF = "/guonopedia/contribute/folktales";

function readErrorMessage(error: unknown, fallback: string): string {
	const message = (error as { data?: { message?: string | string[] } })?.data
		?.message;
	const readable = Array.isArray(message) ? message[0] : message;
	return readable ?? fallback;
}

export function FolktaleEditForm({ folktaleId }: { folktaleId: string }) {
	const { t } = useTranslation("common");
	const { data, isLoading, isError, refetch } =
		useGetMyFolktaleQuery(folktaleId);

	return (
		<FolktaleAccessGate>
			{isLoading && (
				<main className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-16 text-sm text-gray-500">
					<IconLoader2 className="h-5 w-5 animate-spin" />
					{t("loading")}
				</main>
			)}

			{!isLoading && isError && (
				<main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-3 px-4 py-16 text-sm">
					<p className="text-red-700">{t("loadFolktalesFailed")}</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-lg bg-[#0D4D4D] px-4 py-2 text-xs font-semibold text-white"
					>
						{t("tryAgain")}
					</button>
				</main>
			)}

			{!isLoading && !isError && data && data.status !== "draft" && (
				<main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16">
					<Link
						href={`${LIST_HREF}/${data.id}`}
						className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
					>
						<IconArrowLeft className="h-4 w-4" />
						{t("backToFolktale")}
					</Link>
					<section className="flex flex-col gap-2 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6">
						<h1 className="text-xl font-semibold text-[#0D4D4D]">
							{t("folktaleNotEditableTitle")}
						</h1>
						<p className="text-sm leading-relaxed text-gray-600">
							{t("folktaleNotEditableDescription")}
						</p>
					</section>
				</main>
			)}

			{!isLoading && !isError && data && data.status === "draft" && (
				<FolktaleEditFormContent folktale={data} />
			)}
		</FolktaleAccessGate>
	);
}

function FolktaleEditFormContent({ folktale }: { folktale: FolktaleDetail }) {
	const { t } = useTranslation("common");
	const router = useRouter();
	const draft = useFolktaleDraft({
		initialForm: formStateFromFolktale(folktale),
		initialSelectedTerms: selectedTermsFromFolktale(folktale),
	});
	const { save, isSaving } = useFolktaleEditor();
	const {
		form,
		step,
		goNext,
		isFormValid,
		focusFirstInvalidStep,
		focusStoryBodyError,
		setSubmitError,
	} = draft;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (step < REVIEW_STEP) {
			goNext();
			return;
		}

		if (!isFormValid) {
			focusFirstInvalidStep();
			return;
		}

		setSubmitError(null);

		try {
			await save(folktale, form);
			toast.success(t("folktaleUpdated"));
			router.push(`${LIST_HREF}/${folktale.id}`);
		} catch (error) {
			const readable = readErrorMessage(error, t("folktaleActionFailed"));
			setSubmitError(readable);
			toast.error(readable);

			if (/marker/i.test(readable)) {
				focusStoryBodyError();
			}
		}
	};

	return (
		<FolktaleFormShell
			draft={draft}
			listHref={`${LIST_HREF}/${folktale.id}`}
			titleKey="editFolktaleTitle"
			descriptionKey="editFolktaleDescription"
			submitLabelKey="saveChanges"
			submittingLabelKey="savingChanges"
			isSubmitting={isSaving}
			onSubmit={handleSubmit}
		/>
	);
}
