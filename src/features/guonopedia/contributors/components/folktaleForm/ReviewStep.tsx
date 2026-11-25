"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
	getCharacterRoleLabelKey,
	getFolktaleTypeLabelKey,
} from "../../constants/folktales";
import type {
	FolktaleFormState,
	FolktaleStep,
} from "../../folktaleForm/types";

export function ReviewStep({
	form,
	onEdit,
}: {
	form: FolktaleFormState;
	onEdit: (step: FolktaleStep) => void;
}) {
	const { t } = useTranslation("common");
	const characters = form.characters.filter((character) =>
		character.name.trim(),
	);
	const glossary = form.glossary.filter((entry) => entry.term.trim());
	const hasPeople = Boolean(
		form.storytellerName ||
			form.storytellerBio ||
			form.narratorName ||
			form.narratorBio,
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h3 className="text-base font-semibold text-[#0D4D4D]">
					{t("reviewTitle")}
				</h3>
				<p className="text-sm text-[#0D4D4D]/70">{t("reviewHint")}</p>
			</div>

			<ReviewSection
				title={t("stepStory")}
				onEdit={() => onEdit(1)}
				editLabel={t("editLabel")}
			>
				<ReviewRow label={t("titleLabel")} value={form.title} />
				{form.localTitle && (
					<ReviewRow
						label={t("localTitleLabel")}
						value={form.localTitle}
					/>
				)}
				<ReviewRow
					label={t("typeLabel")}
					value={t(getFolktaleTypeLabelKey(form.type))}
				/>
				{form.region && (
					<ReviewRow label={t("regionLabel")} value={form.region} />
				)}
				<ReviewRow label={t("summaryLabel")} value={form.summary} />
				<ReviewRow label={t("bodyLabel")} value={form.body} multiline />
				{form.moral && (
					<ReviewRow label={t("moralLabel")} value={form.moral} />
				)}
				{form.collectedYear && (
					<ReviewRow
						label={t("collectedYearLabel")}
						value={form.collectedYear}
					/>
				)}
				{form.sourceNote && (
					<ReviewRow
						label={t("sourceNoteLabel")}
						value={form.sourceNote}
					/>
				)}
				{form.tags.length > 0 && (
					<ReviewRow
						label={t("tagsLabel")}
						value={form.tags.join(", ")}
					/>
				)}
			</ReviewSection>

			{hasPeople && (
				<ReviewSection
					title={t("stepPeople")}
					onEdit={() => onEdit(2)}
					editLabel={t("editLabel")}
				>
					{form.storytellerName && (
						<ReviewRow
							label={t("storytellerLabel")}
							value={form.storytellerName}
						/>
					)}
					{form.storytellerBio && (
						<ReviewRow
							label={t("storytellerBioLabel")}
							value={form.storytellerBio}
							multiline
						/>
					)}
					{form.narratorName && (
						<ReviewRow
							label={t("narratorLabel")}
							value={form.narratorName}
						/>
					)}
					{form.narratorBio && (
						<ReviewRow
							label={t("narratorBioLabel")}
							value={form.narratorBio}
							multiline
						/>
					)}
				</ReviewSection>
			)}

			<ReviewSection
				title={t("stepCharactersGlossary")}
				onEdit={() => onEdit(3)}
				editLabel={t("editLabel")}
			>
				<div className="flex flex-col gap-2">
					<h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0D4D4D]/50">
						{t("charactersLabel")}
					</h5>
					{characters.length === 0 ? (
						<p className="text-sm text-[#0D4D4D]/60">
							{t("noCharactersAdded")}
						</p>
					) : (
						<ul className="flex flex-col divide-y divide-[#0D4D4D]/10">
							{characters.map((character, index) => (
								<li
									key={`${character.name}-${index}`}
									className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0"
								>
									<p className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
										{character.name}
										{character.localName && (
											<span className="font-normal text-[#0D4D4D]/60">
												{" · "}
												{character.localName}
											</span>
										)}
									</p>
									{character.role && (
										<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
											{t(
												getCharacterRoleLabelKey(
													character.role,
												),
											)}
										</p>
									)}
									{character.description && (
										<p className="break-words text-sm leading-relaxed text-[#0D4D4D]/70 [overflow-wrap:anywhere]">
											{character.description}
										</p>
									)}
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="border-t border-[#0D4D4D]/10" />

				<div className="flex flex-col gap-2">
					<h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0D4D4D]/50">
						{t("glossaryLabel")}
					</h5>
					{glossary.length === 0 ? (
						<p className="text-sm text-[#0D4D4D]/60">
							{t("noGlossaryAdded")}
						</p>
					) : (
						<ul className="flex flex-col divide-y divide-[#0D4D4D]/10">
							{glossary.map((entry, index) => (
								<li
									key={`${entry.term}-${index}`}
									className="flex flex-wrap items-baseline justify-between gap-2 py-2 first:pt-0 last:pb-0"
								>
									<span className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
										{entry.term}
									</span>
									{entry.pronunciation && (
										<span className="text-xs text-[#0D4D4D]/60">
											{entry.pronunciation}
										</span>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			</ReviewSection>
		</div>
	);
}

function ReviewSection({
	title,
	onEdit,
	editLabel,
	children,
}: {
	title: string;
	onEdit: () => void;
	editLabel: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-3 rounded-xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-4">
			<div className="flex items-center justify-between gap-2">
				<h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0D4D4D]/60">
					{title}
				</h4>
				<button
					type="button"
					onClick={onEdit}
					className="text-xs font-semibold text-[#0D4D4D] underline underline-offset-4"
				>
					{editLabel}
				</button>
			</div>
			<div className="flex flex-col gap-2">{children}</div>
		</section>
	);
}

function ReviewRow({
	label,
	value,
	multiline,
}: {
	label: string;
	value: string;
	multiline?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex min-w-0 flex-col gap-0.5 border-b border-[#0D4D4D]/10 pb-2 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
				multiline && "sm:flex-col sm:items-stretch",
			)}
		>
			<span className="text-xs font-medium uppercase tracking-wide text-[#0D4D4D]/50">
				{label}
			</span>
			<span
				className={cn(
					"min-w-0 break-words text-sm text-[#0D4D4D] [overflow-wrap:anywhere]",
					multiline
						? "whitespace-pre-line leading-relaxed"
						: "sm:max-w-[70%] sm:text-right",
				)}
			>
				{value}
			</span>
		</div>
	);
}
