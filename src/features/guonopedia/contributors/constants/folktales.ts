import type { FolktaleStatus, FolktaleType } from "../types/folktales";

export const FOLKTALE_PAGE_SIZE = 9;

interface LabelOption<T extends string> {
	value: T;
	labelKey: string;
}

export const FOLKTALE_TYPE_OPTIONS: LabelOption<FolktaleType>[] = [
	{ value: "trickster", labelKey: "folktaleTypeTrickster" },
	{ value: "origin_myth", labelKey: "folktaleTypeOriginMyth" },
	{ value: "animal_fable", labelKey: "folktaleTypeAnimalFable" },
	{ value: "moral_tale", labelKey: "folktaleTypeMoralTale" },
	{ value: "legend", labelKey: "folktaleTypeLegend" },
	{ value: "supernatural", labelKey: "folktaleTypeSupernatural" },
	{ value: "historical", labelKey: "folktaleTypeHistorical" },
	{ value: "adventure", labelKey: "folktaleTypeAdventure" },
	{ value: "comedy", labelKey: "folktaleTypeComedy" },
	{ value: "romance", labelKey: "folktaleTypeRomance" },
	{ value: "mystery", labelKey: "folktaleTypeMystery" },
	{ value: "tragedy", labelKey: "folktaleTypeTragedy" },
	{ value: "fairy_tale", labelKey: "folktaleTypeFairyTale" },
	{ value: "other", labelKey: "folktaleTypeOther" },
];

export const FOLKTALE_STATUS_OPTIONS: LabelOption<FolktaleStatus>[] = [
	{ value: "draft", labelKey: "folktaleStatusDraft" },
	{ value: "submitted", labelKey: "folktaleStatusSubmitted" },
	{ value: "pending", labelKey: "folktaleStatusPending" },
	{ value: "approved", labelKey: "folktaleStatusApproved" },
	{ value: "rejected", labelKey: "folktaleStatusRejected" },
	{ value: "archived", labelKey: "folktaleStatusArchived" },
];

export const CHARACTER_ROLE_OPTIONS = [
	{ value: "protagonist", labelKey: "characterRoleProtagonist" },
	{ value: "antagonist", labelKey: "characterRoleAntagonist" },
	{ value: "supporting", labelKey: "characterRoleSupporting" },
	{ value: "minor", labelKey: "characterRoleMinor" },
	{ value: "other", labelKey: "characterRoleOther" },
];

const FOLKTALE_TYPE_LABEL_KEYS = new Map<string, string>(
	FOLKTALE_TYPE_OPTIONS.map((option) => [option.value, option.labelKey]),
);

const FOLKTALE_STATUS_LABEL_KEYS = new Map<string, string>(
	FOLKTALE_STATUS_OPTIONS.map((option) => [option.value, option.labelKey]),
);

/**
 * Legacy role values are no longer offered in the dropdown, but older records
 * may still carry them. Keep their labels so existing folktales are never
 * silently relabelled as "Other".
 */
const LEGACY_CHARACTER_ROLE_LABEL_KEYS = new Map<string, string>([
	...CHARACTER_ROLE_OPTIONS.map(
		(option): [string, string] => [option.value, option.labelKey],
	),
	["trickster", "characterRoleTrickster"],
	["helper", "characterRoleHelper"],
]);

export function getFolktaleTypeLabelKey(type: string | undefined): string {
	return FOLKTALE_TYPE_LABEL_KEYS.get(type ?? "") ?? "folktaleTypeOther";
}

export function getFolktaleStatusLabelKey(
	status: string | undefined,
): string {
	return (
		FOLKTALE_STATUS_LABEL_KEYS.get(status ?? "") ?? "folktaleStatusDraft"
	);
}

export function getCharacterRoleLabelKey(role: string | undefined): string {
	return (
		LEGACY_CHARACTER_ROLE_LABEL_KEYS.get(role ?? "") ??
		"characterRoleOther"
	);
}

export function getFolktaleStatusTone(status: string | undefined): {
	badge: string;
	dot: string;
} {
	switch (status) {
		case "approved":
			return {
				badge: "bg-[#E8FDD0] text-[#2F6B00]",
				dot: "bg-[#58CC02]",
			};
		case "pending":
		case "submitted":
			return {
				badge: "bg-[#FFF3D6] text-[#8A5A00]",
				dot: "bg-[#E8A400]",
			};
		case "rejected":
			return {
				badge: "bg-[#FDE8E8] text-[#A61B1B]",
				dot: "bg-[#E53E3E]",
			};
		case "archived":
			return {
				badge: "bg-gray-200 text-gray-700",
				dot: "bg-gray-500",
			};
		default:
			return {
				badge: "border border-[#0D4D4D]/20 bg-white text-[#0D4D4D]",
				dot: "bg-[#0D4D4D]/30",
			};
	}
}
