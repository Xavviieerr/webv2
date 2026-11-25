"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	IconAlertTriangle,
	IconArrowLeft,
	IconArrowRight,
	IconBook2,
	IconLoader2,
} from "@tabler/icons-react";
import { FOLKTALE_STEPS, REVIEW_STEP } from "../../folktaleForm/types";
import type { FolktaleDraftController } from "../../folktaleForm/useFolktaleDraft";
import { CharactersGlossaryStep } from "./CharactersGlossaryStep";
import { PeopleStep } from "./PeopleStep";
import { ReviewStep } from "./ReviewStep";
import { StepIndicator } from "./StepIndicator";
import { StoryStep } from "./StoryStep";

interface FolktaleFormShellProps {
	draft: FolktaleDraftController;
	listHref: string;
	titleKey: string;
	descriptionKey: string;
	submitLabelKey: string;
	submittingLabelKey: string;
	submitHintKey?: string;
	isSubmitting: boolean;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function FolktaleFormShell({
	draft,
	listHref,
	titleKey,
	descriptionKey,
	submitLabelKey,
	submittingLabelKey,
	submitHintKey,
	isSubmitting,
	onSubmit,
}: FolktaleFormShellProps) {
	const { t } = useTranslation("common");
	const { step, selectStep, goBack, submitError, formTopRef } = draft;

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<Link
				href={listHref}
				className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#0D4D4D] hover:underline"
			>
				<IconArrowLeft className="h-4 w-4" />
				{t("backToMyFolktales")}
			</Link>

			<header className="relative overflow-hidden rounded-3xl bg-[#D4E8EA] p-6 sm:p-8">
				<div className="relative z-10 flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-white">
							<IconBook2 className="h-6 w-6" />
						</span>
						<div>
							<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D4D4D]/60">
								{t("folktales")}
							</p>
							<h1 className="text-2xl font-semibold text-[#0D4D4D] sm:text-3xl">
								{t(titleKey)}
							</h1>
						</div>
					</div>
					<p className="max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
						{t(descriptionKey)}
					</p>
				</div>
				<div
					aria-hidden
					className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/40"
				/>
			</header>

			<StepIndicator step={step} onSelect={selectStep} />

			<p className="-mt-2 text-xs text-[#0D4D4D]/60">
				{t("requiredFieldsHint")}
			</p>

			<div ref={formTopRef} />

			<form
				onSubmit={onSubmit}
				noValidate
				className="flex flex-col gap-6 rounded-2xl border border-[#0D4D4D]/10 bg-[#F2FEFF] p-5 sm:p-7"
			>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 className="text-lg font-semibold text-[#0D4D4D]">
						{t(FOLKTALE_STEPS[step - 1].labelKey)}
					</h2>
					<span className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
						{t("stepCounter", {
							current: step,
							total: FOLKTALE_STEPS.length,
						})}
					</span>
				</div>

				{step === 1 && <StoryStep draft={draft} />}
				{step === 2 && <PeopleStep draft={draft} />}
				{step === 3 && <CharactersGlossaryStep draft={draft} />}
				{step === 4 && (
					<ReviewStep form={draft.form} onEdit={selectStep} />
				)}

				{submitError && (
					<div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						<IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
						<span>{submitError}</span>
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0D4D4D]/10 pt-5">
					<Link
						href={listHref}
						className="text-sm font-medium text-[#0D4D4D]/70 hover:underline"
					>
						{t("backToMyFolktales")}
					</Link>

					<div className="flex flex-col items-end gap-2">
						<div className="flex items-center gap-2">
							{step > 1 && (
								<button
									type="button"
									onClick={goBack}
									disabled={isSubmitting}
									className="rounded-full border border-[#0D4D4D]/20 px-5 py-2.5 text-sm font-semibold text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA] disabled:opacity-50"
								>
									{t("backStep")}
								</button>
							)}

							{step < REVIEW_STEP ? (
								<button
									type="submit"
									className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								>
									{t("nextStep")}
									<IconArrowRight className="h-4 w-4" />
								</button>
							) : (
								<button
									type="submit"
									disabled={isSubmitting}
									className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
								>
									{isSubmitting ? (
										<>
											<IconLoader2 className="h-4 w-4 animate-spin" />
											{t(submittingLabelKey)}
										</>
									) : (
										<>
											{t(submitLabelKey)}
											<IconArrowRight className="h-4 w-4" />
										</>
									)}
								</button>
							)}
						</div>
						{step === REVIEW_STEP && submitHintKey && (
							<p className="max-w-xs text-right text-xs leading-relaxed text-[#0D4D4D]/60">
								{t(submitHintKey)}
							</p>
						)}
					</div>
				</div>
			</form>
		</main>
	);
}
