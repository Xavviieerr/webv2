"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useCreateFolktaleMutation } from "../api/folktaleEndpoints";
import { buildFolktalePayload } from "../folktaleForm/payload";
import { REVIEW_STEP } from "../folktaleForm/types";
import { useFolktaleDraft } from "../folktaleForm/useFolktaleDraft";
import type { CreateFolktaleResponse } from "../types/folktales";
import { FolktaleAccessGate } from "./FolktaleAccessGate";
import { FolktaleFormShell } from "./folktaleForm/FolktaleFormShell";

const LIST_HREF = "/guonopedia/contribute/folktales";

export function FolktaleCreateForm() {
	const { t } = useTranslation("common");
	const router = useRouter();
	const [createFolktale, { isLoading: isSubmitting }] =
		useCreateFolktaleMutation();
	const draft = useFolktaleDraft();
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
			const response = await createFolktale(
				buildFolktalePayload(form),
			).unwrap();
			toast.success(t("folktaleDraftSaved"));
			const created =
				response?.data ??
				(response as unknown as CreateFolktaleResponse["data"]);
			const id = created?.id;
			router.push(id ? `${LIST_HREF}/${id}` : LIST_HREF);
		} catch (error: unknown) {
			const message = (
				error as { data?: { message?: string | string[] } }
			)?.data?.message;
			const readable = Array.isArray(message) ? message[0] : message;
			const fallback = readable ?? t("folktaleSubmitFailed");
			setSubmitError(fallback);
			toast.error(fallback);

			// Field-level API errors belong to the step that owns the field,
			// not the review screen. Marker errors always point at the story.
			if (readable && /marker/i.test(readable)) {
				focusStoryBodyError();
			}
		}
	};

	return (
		<FolktaleAccessGate>
			<FolktaleFormShell
				draft={draft}
				listHref={LIST_HREF}
				titleKey="contributeFolktale"
				descriptionKey="contributeFolktaleDescription"
				submitLabelKey="saveFolktaleDraft"
				submittingLabelKey="savingFolktaleDraft"
				submitHintKey="draftSaveHint"
				isSubmitting={isSubmitting}
				onSubmit={handleSubmit}
			/>
		</FolktaleAccessGate>
	);
}
