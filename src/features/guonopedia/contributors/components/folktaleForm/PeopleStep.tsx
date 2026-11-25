"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { FolktaleDraftController } from "../../folktaleForm/useFolktaleDraft";
import { Field, inputClassName } from "./fields";

export function PeopleStep({ draft }: { draft: FolktaleDraftController }) {
	const { t } = useTranslation("common");
	const { form, update, markTouched } = draft;

	return (
		<div className="flex flex-col gap-5">
			<p className="max-w-2xl text-sm leading-relaxed text-[#0D4D4D]/70">
				{t("peopleHint")}
			</p>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field
					id="folktale-storyteller-name"
					label={t("storytellerNameLabel")}
					optional
				>
					<input
						id="folktale-storyteller-name"
						value={form.storytellerName}
						onChange={(event) =>
							update("storytellerName", event.target.value)
						}
						onBlur={() => markTouched("storytellerName")}
						placeholder={t("folktaleStorytellerNamePlaceholder")}
						className={inputClassName()}
					/>
				</Field>

				<Field
					id="folktale-narrator-name"
					label={t("narratorNameLabel")}
					optional
				>
					<input
						id="folktale-narrator-name"
						value={form.narratorName}
						onChange={(event) =>
							update("narratorName", event.target.value)
						}
						onBlur={() => markTouched("narratorName")}
						placeholder={t("folktaleNarratorNamePlaceholder")}
						className={inputClassName()}
					/>
				</Field>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field
					id="folktale-storyteller-bio"
					label={t("storytellerBioLabel")}
					optional
				>
					<textarea
						id="folktale-storyteller-bio"
						rows={4}
						value={form.storytellerBio}
						onChange={(event) =>
							update("storytellerBio", event.target.value)
						}
						placeholder={t("folktaleStorytellerBioPlaceholder")}
						className={cn(inputClassName(), "resize-y")}
					/>
				</Field>

				<Field
					id="folktale-narrator-bio"
					label={t("narratorBioLabel")}
					optional
				>
					<textarea
						id="folktale-narrator-bio"
						rows={4}
						value={form.narratorBio}
						onChange={(event) =>
							update("narratorBio", event.target.value)
						}
						placeholder={t("folktaleNarratorBioPlaceholder")}
						className={cn(inputClassName(), "resize-y")}
					/>
				</Field>
			</div>
		</div>
	);
}
