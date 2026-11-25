"use client";

import { useTranslation } from "react-i18next";
import { IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FOLKTALE_TYPE_OPTIONS } from "../../constants/folktales";
import type { FolktaleDraftController } from "../../folktaleForm/useFolktaleDraft";
import { Field, FolktaleSelect, inputClassName } from "./fields";

export function StoryStep({ draft }: { draft: FolktaleDraftController }) {
	const { t } = useTranslation("common");
	const { form, update, storyErrors, storyMarker, showError, markTouched } =
		draft;

	return (
		<div className="flex flex-col gap-5">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field
					id="folktale-title"
					label={t("titleLabel")}
					required
					error={
						showError("title", 1) && storyErrors.title
							? t(storyErrors.title)
							: undefined
					}
				>
					<input
						id="folktale-title"
						value={form.title}
						onChange={(event) => update("title", event.target.value)}
						onBlur={() => markTouched("title")}
						placeholder={t("folktaleTitlePlaceholder")}
						className={inputClassName(
							showError("title", 1) && Boolean(storyErrors.title),
						)}
					/>
				</Field>

				<Field
					id="folktale-local-title"
					label={t("localTitleLabel")}
					optional
				>
					<input
						id="folktale-local-title"
						value={form.localTitle}
						onChange={(event) =>
							update("localTitle", event.target.value)
						}
						placeholder={t("folktaleLocalTitlePlaceholder")}
						className={inputClassName()}
					/>
				</Field>

				<Field
					id="folktale-type"
					label={t("typeLabel")}
					required
					error={
						showError("type", 1) && storyErrors.type
							? t(storyErrors.type)
							: undefined
					}
				>
					<FolktaleSelect
						id="folktale-type"
						value={form.type}
						placeholder={t("typeLabel")}
						options={FOLKTALE_TYPE_OPTIONS.map((option) => ({
							value: option.value,
							label: t(option.labelKey),
						}))}
						onChange={(value) => update("type", value)}
						onBlur={() => markTouched("type")}
						hasError={
							showError("type", 1) && Boolean(storyErrors.type)
						}
					/>
				</Field>

				<Field id="folktale-region" label={t("regionLabel")} optional>
					<input
						id="folktale-region"
						value={form.region}
						onChange={(event) =>
							update("region", event.target.value)
						}
						placeholder={t("folktaleRegionPlaceholder")}
						className={inputClassName()}
					/>
				</Field>
			</div>

			<Field
				id="folktale-summary"
				label={t("summaryLabel")}
				required
				hint={t("summaryHint")}
				error={
					showError("summary", 1) && storyErrors.summary
						? t(storyErrors.summary)
						: undefined
				}
			>
				<textarea
					id="folktale-summary"
					rows={3}
					value={form.summary}
					onChange={(event) => update("summary", event.target.value)}
					onBlur={() => markTouched("summary")}
					placeholder={t("folktaleSummaryPlaceholder")}
					className={cn(
						inputClassName(
							showError("summary", 1) &&
								Boolean(storyErrors.summary),
						),
						"resize-y",
					)}
				/>
			</Field>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="folktale-body"
					className="text-sm font-semibold text-[#0D4D4D]"
				>
					{t("bodyLabel")}{" "}
					<span className="font-normal text-[#0D4D4D]/50">
						({t("requiredLabel")})
					</span>
				</label>
				<p className="text-xs leading-relaxed text-[#0D4D4D]/60">
					{t("bodyHint")}
				</p>
				<textarea
					id="folktale-body"
					rows={12}
					value={form.body}
					onChange={(event) => update("body", event.target.value)}
					onBlur={() => markTouched("body")}
					placeholder={t("folktaleBodyPlaceholder")}
					className={cn(
						inputClassName(
							showError("body", 1) &&
								Boolean(storyErrors.body || storyMarker),
						),
						"resize-y break-words font-[inherit] leading-7 [overflow-wrap:anywhere]",
					)}
				/>
				{showError("body", 1) && storyErrors.body && (
					<p className="text-xs font-medium text-red-600">
						{t(storyErrors.body)}
					</p>
				)}
				{showError("body", 1) && storyMarker && (
					<p className="text-xs font-medium text-red-600">
						{t("removeStoryMarker", { marker: storyMarker })}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field id="folktale-moral" label={t("moralLabel")} optional>
					<textarea
						id="folktale-moral"
						rows={3}
						value={form.moral}
						onChange={(event) => update("moral", event.target.value)}
						placeholder={t("folktaleMoralPlaceholder")}
						className={cn(inputClassName(), "resize-y")}
					/>
				</Field>

				<Field
					id="folktale-source"
					label={t("sourceNoteLabel")}
					optional
				>
					<textarea
						id="folktale-source"
						rows={3}
						value={form.sourceNote}
						onChange={(event) =>
							update("sourceNote", event.target.value)
						}
						placeholder={t("folktaleSourceNotePlaceholder")}
						className={cn(inputClassName(), "resize-y")}
					/>
				</Field>

				<Field
					id="folktale-collected-year"
					label={t("collectedYearLabel")}
					hint={t("collectedYearHint")}
					optional
				>
					<input
						id="folktale-collected-year"
						value={form.collectedYear}
						onChange={(event) =>
							update(
								"collectedYear",
								event.target.value.replace(/[^\d]/g, ""),
							)
						}
						placeholder="2022"
						inputMode="numeric"
						maxLength={4}
						className={inputClassName()}
					/>
				</Field>
			</div>

			<Field id="folktale-tags" label={t("tagsLabel")} optional>
				<div className="flex flex-col gap-2">
					{form.tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{form.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 rounded-full border border-[#0D4D4D]/15 bg-white px-2.5 py-1 text-xs font-medium text-[#0D4D4D]"
								>
									{tag}
									<button
										type="button"
										onClick={() =>
											update(
												"tags",
												form.tags.filter(
													(item) => item !== tag,
												),
											)
										}
										aria-label={`${t("removeLabel")} ${tag}`}
										className="rounded-full p-0.5 hover:bg-[#0D4D4D]/10"
									>
										<IconTrash className="h-3 w-3" />
									</button>
								</span>
							))}
						</div>
					)}
					<input
						id="folktale-tags"
						value={form.tagInput}
						onChange={(event) =>
							update("tagInput", event.target.value)
						}
						onKeyDown={draft.handleTagKeyDown}
						onBlur={draft.addTag}
						placeholder={t("folktaleTagPlaceholder")}
						className={inputClassName()}
					/>
					<p className="text-xs text-[#0D4D4D]/60">
						{t("tagsHint")}
					</p>
				</div>
			</Field>
		</div>
	);
}
