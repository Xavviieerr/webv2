"use client";

import { useTranslation } from "react-i18next";

export function ApplicationDetailsFields({
	expertise,
	applicationNote,
	errors,
	onExpertiseChange,
	onApplicationNoteChange,
}: {
	expertise: string;
	applicationNote: string;
	errors: Record<string, string>;
	onExpertiseChange: (value: string) => void;
	onApplicationNoteChange: (value: string) => void;
}) {
	const { t } = useTranslation("common");

	return (
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
					onChange={(event) => onExpertiseChange(event.target.value)}
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
						onApplicationNoteChange(event.target.value)
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
	);
}
