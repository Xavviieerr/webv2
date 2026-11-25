import type {
	CreateFolktalePayload,
	FolktaleType,
} from "../types/folktales";
import { cleanText, type CharacterDraft, type FolktaleFormState, type GlossaryDraft } from "./types";

export function buildCharacterPayload(character: CharacterDraft, order: number) {
	return {
		name: character.name.trim(),
		localName: cleanText(character.localName),
		role: cleanText(character.role),
		description: cleanText(character.description),
		order,
	};
}

export function buildGlossaryPayload(entry: GlossaryDraft, order: number) {
	return {
		term: entry.term.trim(),
		pronunciation: cleanText(entry.pronunciation),
		order,
	};
}

/**
 * Build the story payload. Media fields, nested collections and status are
 * intentionally omitted: contributors never author them, and the API owns
 * illustrations.
 */
export function buildFolktalePayload(
	form: FolktaleFormState,
): CreateFolktalePayload {
	const payload: CreateFolktalePayload = {
		title: form.title.trim(),
		summary: form.summary.trim(),
		body: form.body.trim(),
		type: form.type as FolktaleType,
	};

	const localTitle = cleanText(form.localTitle);
	if (localTitle) payload.localTitle = localTitle;

	const moral = cleanText(form.moral);
	if (moral) payload.moral = moral;

	const region = cleanText(form.region);
	if (region) payload.region = region;

	const tags = form.tags.map((tag) => tag.trim()).filter(Boolean);
	if (tags.length) payload.tags = tags;

	const collectedYear = cleanText(form.collectedYear);
	if (collectedYear) payload.collectedYear = collectedYear;

	const sourceNote = cleanText(form.sourceNote);
	if (sourceNote) payload.sourceNote = sourceNote;

	const storytellerName = cleanText(form.storytellerName);
	if (storytellerName) payload.storytellerName = storytellerName;

	const storytellerBio = cleanText(form.storytellerBio);
	if (storytellerBio) payload.storytellerBio = storytellerBio;

	const narratorName = cleanText(form.narratorName);
	if (narratorName) payload.narratorName = narratorName;

	const narratorBio = cleanText(form.narratorBio);
	if (narratorBio) payload.narratorBio = narratorBio;

	const characters = form.characters
		.filter((character) => character.name.trim())
		.map((character, index) => buildCharacterPayload(character, index + 1));
	if (characters.length) payload.characters = characters;

	const glossary = form.glossary
		.filter((entry) => entry.term.trim())
		.map((entry, index) => buildGlossaryPayload(entry, index + 1));
	if (glossary.length) payload.glossary = glossary;

	return payload;
}
