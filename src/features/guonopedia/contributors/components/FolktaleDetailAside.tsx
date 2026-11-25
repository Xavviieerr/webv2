"use client";

import { useTranslation } from "react-i18next";
import {
	IconBook,
	IconBook2,
	IconCalendar,
	IconMapPin,
	IconMicrophone2,
	IconTag,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import { getCharacterRoleLabelKey } from "../constants/folktales";
import type { FolktaleDetail } from "../types/folktales";
import { FolktaleInfoPanel, FolktaleInfoRow } from "./FolktaleInfoPanel";

export function FolktaleDetailAside({ folktale }: { folktale: FolktaleDetail }) {
	const { t } = useTranslation("common");
	const tags = folktale.tags ?? [];
	const characters = folktale.characters ?? [];
	const glossary = folktale.glossary ?? [];
	const hasNarration =
		Boolean(folktale.audioUrl) ||
		Boolean(folktale.narratorName) ||
		Boolean(folktale.narratorBio);
	const hasSource =
		Boolean(folktale.sourceNote) || Boolean(folktale.collectedYear);
	const hasStoryteller = Boolean(
		folktale.storytellerName || folktale.storytellerBio,
	);
	const hasAtAGlance = Boolean(
		folktale.region ||
			folktale.collectedYear ||
			folktale.moral ||
			tags.length > 0,
	);

	return (
		<aside className="flex flex-col gap-4">
			{hasAtAGlance && (
				<FolktaleInfoPanel
					title={t("atAGlanceLabel")}
					icon={<IconBook className="h-4 w-4" />}
				>
					<div className="flex flex-col gap-3">
						{folktale.region && (
							<FolktaleInfoRow
								icon={<IconMapPin className="h-3.5 w-3.5" />}
								label={t("regionLabel")}
								value={folktale.region}
							/>
						)}
						{folktale.collectedYear && (
							<FolktaleInfoRow
								icon={<IconCalendar className="h-3.5 w-3.5" />}
								label={t("collectedYearLabel")}
								value={folktale.collectedYear}
							/>
						)}
						{tags.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
									<IconTag className="h-3.5 w-3.5" />
									{t("tagsLabel")}
								</span>
								<div className="flex flex-wrap gap-1.5">
									{tags.map((tag) => (
										<span
											key={tag}
											className="break-words rounded-full border border-[#0D4D4D]/10 bg-[#F2FEFF] px-2.5 py-1 text-xs font-medium text-[#0D4D4D] [overflow-wrap:anywhere]"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}
						{folktale.moral && (
							<div className="rounded-xl border border-[#0D4D4D]/10 bg-[#FBF5EA] p-3">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
									{t("moralLabel")}
								</p>
								<p className="mt-1 break-words text-sm leading-relaxed text-[#0D4D4D] [overflow-wrap:anywhere]">
									{folktale.moral}
								</p>
							</div>
						)}
					</div>
				</FolktaleInfoPanel>
			)}

			{hasStoryteller && (
				<FolktaleInfoPanel
					title={t("storytellerLabel")}
					icon={<IconUser className="h-4 w-4" />}
				>
					<div className="flex flex-col gap-1">
						{folktale.storytellerName && (
							<p className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
								{folktale.storytellerName}
							</p>
						)}
						{folktale.storytellerBio && (
							<p className="break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
								{folktale.storytellerBio}
							</p>
						)}
					</div>
				</FolktaleInfoPanel>
			)}

			{hasNarration && (
				<FolktaleInfoPanel
					title={t("narrationLabel")}
					icon={<IconMicrophone2 className="h-4 w-4" />}
				>
					<div className="flex flex-col gap-2">
						{folktale.narratorName && (
							<p className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
								{folktale.narratorName}
							</p>
						)}
						{folktale.narratorBio && (
							<p className="break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
								{folktale.narratorBio}
							</p>
						)}
						{folktale.audioUrl ? (
							<audio
								controls
								src={folktale.audioUrl}
								className="w-full"
							/>
						) : (
							<p className="text-xs text-gray-500">
								{t("noRecordingYet")}
							</p>
						)}
					</div>
				</FolktaleInfoPanel>
			)}

			{characters.length > 0 && (
				<FolktaleInfoPanel
					title={t("charactersLabel")}
					icon={<IconUsers className="h-4 w-4" />}
				>
					<ul className="flex flex-col gap-3">
						{characters.map((character, index) => (
							<li
								key={`${character.name}-${index}`}
								className="flex flex-col gap-0.5 border-b border-[#0D4D4D]/10 pb-3 last:border-b-0 last:pb-0"
							>
								<span className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
									{character.name}
									{character.localName && (
										<span className="font-normal text-[#0D4D4D]/60">
											{" "}
											· {character.localName}
										</span>
									)}
								</span>
								{character.role && (
									<span className="text-[11px] font-medium uppercase tracking-wide text-[#0D4D4D]/50">
										{t(
											getCharacterRoleLabelKey(
												character.role,
											),
										)}
									</span>
								)}
								{character.description && (
									<span className="break-words text-xs leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
										{character.description}
									</span>
								)}
							</li>
						))}
					</ul>
				</FolktaleInfoPanel>
			)}

			{glossary.length > 0 && (
				<FolktaleInfoPanel
					title={t("glossaryLabel")}
					icon={<IconBook className="h-4 w-4" />}
				>
					<ul className="flex flex-col gap-2.5">
						{glossary.map((entry, index) => (
							<li
								key={`${entry.term}-${index}`}
								className="flex flex-col gap-0.5"
							>
								<span className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
									{entry.term}
								</span>
								{entry.pronunciation && (
									<span className="break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
										{t("pronunciationLabel")}:{" "}
										{entry.pronunciation}
									</span>
								)}
							</li>
						))}
					</ul>
				</FolktaleInfoPanel>
			)}

			{hasSource && (
				<FolktaleInfoPanel
					title={t("sourceNoteLabel")}
					icon={<IconBook2 className="h-4 w-4" />}
				>
					<div className="flex flex-col gap-1 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
						{folktale.collectedYear && (
							<span>
								{t("collectedYearLabel")}:{" "}
								{folktale.collectedYear}
							</span>
						)}
						{folktale.sourceNote && (
							<span>{folktale.sourceNote}</span>
						)}
					</div>
				</FolktaleInfoPanel>
			)}
		</aside>
	);
}
