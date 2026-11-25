import type { FolktaleDetail } from "../types/folktales";

export interface CharacterDraft {
	/** Present only for characters that already exist on the server. */
	id?: string;
	name: string;
	localName: string;
	role: string;
	description: string;
}

export interface GlossaryDraft {
	/** Present only for glossary entries that already exist on the server. */
	id?: string;
	term: string;
	pronunciation: string;
}

export interface FolktaleFormState {
	title: string;
	localTitle: string;
	summary: string;
	body: string;
	type: string;
	moral: string;
	region: string;
	tags: string[];
	tagInput: string;
	collectedYear: string;
	sourceNote: string;
	storytellerName: string;
	storytellerBio: string;
	narratorName: string;
	narratorBio: string;
	characters: CharacterDraft[];
	glossary: GlossaryDraft[];
}

export type FolktaleStep = 1 | 2 | 3 | 4;

export const FOLKTALE_STEPS: Array<{ id: FolktaleStep; labelKey: string }> = [
	{ id: 1, labelKey: "stepStory" },
	{ id: 2, labelKey: "stepPeople" },
	{ id: 3, labelKey: "stepCharactersGlossary" },
	{ id: 4, labelKey: "stepReview" },
];

export const STORY_STEP: FolktaleStep = 1;
export const CHARACTERS_STEP: FolktaleStep = 3;
export const REVIEW_STEP: FolktaleStep = 4;

export const EMPTY_FOLKTALE_FORM: FolktaleFormState = {
	title: "",
	localTitle: "",
	summary: "",
	body: "",
	type: "",
	moral: "",
	region: "",
	tags: [],
	tagInput: "",
	collectedYear: "",
	sourceNote: "",
	storytellerName: "",
	storytellerBio: "",
	narratorName: "",
	narratorBio: "",
	characters: [],
	glossary: [],
};

export const EMPTY_CHARACTER: CharacterDraft = {
	name: "",
	localName: "",
	role: "",
	description: "",
};

export const EMPTY_GLOSSARY: GlossaryDraft = {
	term: "",
	pronunciation: "",
};

export function cleanText(value: string): string | undefined {
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
}

/**
 * Map a folktale returned by the API into the editable form shape. Ids are kept
 * so the edit flow can decide between PATCH and create/delete calls.
 */
export function formStateFromFolktale(
	folktale: FolktaleDetail,
): FolktaleFormState {
	return {
		title: folktale.title ?? "",
		localTitle: folktale.localTitle ?? "",
		summary: folktale.summary ?? "",
		body: folktale.body ?? "",
		type: folktale.type ?? "",
		moral: folktale.moral ?? "",
		region: folktale.region ?? "",
		tags: folktale.tags ?? [],
		tagInput: "",
		collectedYear: folktale.collectedYear ?? "",
		sourceNote: folktale.sourceNote ?? "",
		storytellerName: folktale.storytellerName ?? "",
		storytellerBio: folktale.storytellerBio ?? "",
		narratorName: folktale.narratorName ?? "",
		narratorBio: folktale.narratorBio ?? "",
		characters: (folktale.characters ?? []).map((character) => ({
			id: character.id,
			name: character.name ?? "",
			localName: character.localName ?? "",
			role: character.role ?? "",
			description: character.description ?? "",
		})),
		glossary: (folktale.glossary ?? []).map((entry) => ({
			id: entry.id,
			term: entry.term ?? "",
			pronunciation: entry.pronunciation ?? "",
		})),
	};
}

/**
 * Server-provided character and glossary values are already dictionary words,
 * so they count as chosen terms when an existing draft is opened for editing.
 */
export function selectedTermsFromFolktale(
	folktale: FolktaleDetail,
): string[] {
	return (folktale.glossary ?? [])
		.map((entry) => entry.term?.trim().toLowerCase())
		.filter((entry): entry is string => Boolean(entry));
}
