"use client";

import { useTranslation } from "react-i18next";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { CHARACTER_ROLE_OPTIONS } from "../../constants/folktales";
import type { FolktaleDraftController } from "../../folktaleForm/useFolktaleDraft";
import { GlossaryTermPicker } from "../GlossaryTermPicker";
import { Field, FolktaleSelect, inputClassName } from "./fields";

export function CharactersGlossaryStep({
	draft,
}: {
	draft: FolktaleDraftController;
}) {
	const { t } = useTranslation("common");
	const {
		form,
		characterErrors,
		glossaryErrors,
		duplicateGlossaryTerms,
		selectedGlossaryTerms,
		showError,
		markTouched,
		addCharacter,
		updateCharacter,
		removeCharacter,
		addGlossaryEntry,
		updateGlossaryEntry,
		removeGlossaryEntry,
		markGlossaryTermSelected,
		forgetGlossaryTerm,
	} = draft;

	return (
		<div className="flex flex-col gap-7">
			<section className="flex flex-col gap-3">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h3 className="text-base font-semibold text-[#0D4D4D]">
							{t("charactersLabel")}
						</h3>
						<p className="max-w-2xl text-sm leading-relaxed text-[#0D4D4D]/70">
							{t("charactersHint")}
						</p>
					</div>
					<button
						type="button"
						onClick={addCharacter}
						className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D4D]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40"
					>
						<IconPlus className="h-3.5 w-3.5" />
						{t("addCharacter")}
					</button>
				</div>

				{form.characters.length === 0 && (
					<p className="rounded-xl border border-dashed border-[#0D4D4D]/20 bg-[#D4E8EA] px-4 py-3 text-sm text-[#0D4D4D]/60">
						{t("charactersHint")}
					</p>
				)}

				{form.characters.map((character, index) => {
					const nameKey = `character-${index}-name`;
					const nameError = characterErrors[nameKey];

					return (
						<div
							key={index}
							className="flex flex-col gap-3 rounded-xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-4"
						>
							<div className="flex items-center justify-between gap-2">
								<p className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]/60">
									{index + 1}
								</p>
								<button
									type="button"
									onClick={() => removeCharacter(index)}
									className="inline-flex items-center gap-1 text-xs font-medium text-[#0D4D4D]/60 hover:text-red-600"
								>
									<IconTrash className="h-3.5 w-3.5" />
									{t("removeLabel")}
								</button>
							</div>

							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<Field
									id={`character-${index}-name`}
									label={t("characterNameLabel")}
									required
									error={
										showError(nameKey, 3) && nameError
											? t(nameError)
											: undefined
									}
								>
									<input
										id={`character-${index}-name`}
										value={character.name}
										onChange={(event) =>
											updateCharacter(index, {
												name: event.target.value,
											})
										}
										onBlur={() => markTouched(nameKey)}
										placeholder={t(
											"folktaleCharacterNamePlaceholder",
										)}
										className={inputClassName(
											showError(nameKey, 3) &&
												Boolean(nameError),
										)}
									/>
								</Field>

								<Field
									id={`character-${index}-local-name`}
									label={t("characterLocalNameLabel")}
									optional
								>
									<input
										id={`character-${index}-local-name`}
										value={character.localName}
										onChange={(event) =>
											updateCharacter(index, {
												localName:
													event.target.value,
											})
										}
										placeholder={t(
											"folktaleCharacterLocalNamePlaceholder",
										)}
										className={inputClassName()}
									/>
								</Field>

								<Field
									id={`character-${index}-role`}
									label={t("characterRoleLabel")}
									optional
								>
									<FolktaleSelect
										id={`character-${index}-role`}
										value={character.role}
										placeholder={t("characterRoleLabel")}
										options={CHARACTER_ROLE_OPTIONS.map(
											(option) => ({
												value: option.value,
												label: t(option.labelKey),
											}),
										)}
										onChange={(value) =>
											updateCharacter(index, {
												role: value,
											})
										}
									/>
								</Field>

								<Field
									id={`character-${index}-description`}
									label={t("characterDescriptionLabel")}
									optional
								>
									<input
										id={`character-${index}-description`}
										value={character.description}
										onChange={(event) =>
											updateCharacter(index, {
												description:
													event.target.value,
											})
										}
										placeholder={t(
											"folktaleCharacterDescriptionPlaceholder",
										)}
										className={inputClassName()}
									/>
								</Field>
							</div>
						</div>
					);
				})}
			</section>

			<div className="border-t border-[#0D4D4D]/10" />

			<section className="flex flex-col gap-3">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h3 className="text-base font-semibold text-[#0D4D4D]">
							{t("glossaryLabel")}
						</h3>
						<p className="max-w-2xl text-sm leading-relaxed text-[#0D4D4D]/70">
							{t("glossaryHint")}
						</p>
					</div>
					<button
						type="button"
						onClick={addGlossaryEntry}
						className="inline-flex items-center gap-1.5 rounded-full border border-[#0D4D4D]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40"
					>
						<IconPlus className="h-3.5 w-3.5" />
						{t("addGlossaryTerm")}
					</button>
				</div>

				{form.glossary.length === 0 && (
					<p className="rounded-xl border border-dashed border-[#0D4D4D]/20 bg-[#D4E8EA] px-4 py-3 text-sm text-[#0D4D4D]/60">
						{t("glossaryHint")}
					</p>
				)}

				{form.glossary.map((entry, index) => {
					const termKey = `glossary-${index}-term`;
					const termError = glossaryErrors[termKey];
					const isDuplicate = duplicateGlossaryTerms.includes(
						entry.term.trim().toLowerCase(),
					);
					const isSelected = selectedGlossaryTerms.includes(
						entry.term.trim().toLowerCase(),
					);

					return (
						<div
							key={index}
							className="flex flex-col gap-3 rounded-xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-4"
						>
							<div className="flex items-center justify-between gap-2">
								<p className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]/60">
									{index + 1}
								</p>
								<button
									type="button"
									onClick={() => removeGlossaryEntry(index)}
									className="inline-flex items-center gap-1 text-xs font-medium text-[#0D4D4D]/60 hover:text-red-600"
								>
									<IconTrash className="h-3.5 w-3.5" />
									{t("removeLabel")}
								</button>
							</div>

							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<Field
									id={`glossary-${index}-term`}
									label={t("glossaryTermLabel")}
									required
									hint={t("glossarySearchHint")}
									error={
										showError(termKey, 3) && termError
											? t(termError)
											: undefined
									}
								>
									<GlossaryTermPicker
										id={`glossary-${index}-term`}
										value={entry.term}
										selected={Boolean(
											entry.term.trim() && isSelected,
										)}
										hasError={
											showError(termKey, 3) &&
											Boolean(termError)
										}
										onChange={(value) => {
											if (value !== entry.term) {
												forgetGlossaryTerm(
													entry.term,
												);
												updateGlossaryEntry(index, {
													term: value,
												});
											}
										}}
										onSelect={(word) => {
											forgetGlossaryTerm(entry.term);
											updateGlossaryEntry(index, {
												term: word,
											});
											markGlossaryTermSelected(word);
										}}
										onBlur={() => markTouched(termKey)}
									/>
									{showError(termKey, 3) && isDuplicate && (
										<p className="text-xs font-medium text-red-600">
											{t("duplicateGlossaryTerm", {
												term: entry.term.trim(),
											})}
										</p>
									)}
								</Field>

								<Field
									id={`glossary-${index}-pronunciation`}
									label={t("glossaryPronunciationLabel")}
									optional
								>
									<input
										id={`glossary-${index}-pronunciation`}
										value={entry.pronunciation}
										onChange={(event) =>
											updateGlossaryEntry(index, {
												pronunciation:
													event.target.value,
											})
										}
										placeholder={t(
											"folktalePronunciationPlaceholder",
										)}
										className={inputClassName()}
									/>
								</Field>
							</div>
						</div>
					);
				})}
			</section>
		</div>
	);
}
