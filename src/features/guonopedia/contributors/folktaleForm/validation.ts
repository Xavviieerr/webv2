import { findDuplicateGlossaryTerms, folktaleStoryDraftSchema } from "../schemas/folktaleSchema";
import type {
	CharacterDraft,
	FolktaleFormState,
	GlossaryDraft,
} from "./types";

export function getStoryErrors(form: FolktaleFormState): Record<string, string> {
	const parsed = folktaleStoryDraftSchema.safeParse({
		title: form.title,
		summary: form.summary,
		body: form.body,
		type: form.type,
	});

	if (parsed.success) return {};

	const fieldErrors: Record<string, string> = {};
	parsed.error.issues.forEach((issue) => {
		fieldErrors[String(issue.path[0])] = issue.message;
	});
	return fieldErrors;
}

export function getCharacterErrors(
	characters: CharacterDraft[],
): Record<string, string> {
	const errors: Record<string, string> = {};
	characters.forEach((character, index) => {
		const hasAnyValue =
			character.name.trim() ||
			character.localName.trim() ||
			character.role.trim() ||
			character.description.trim();
		if (hasAnyValue && !character.name.trim()) {
			errors[`character-${index}-name`] = "requiredField";
		}
	});
	return errors;
}

export function getGlossaryErrors(
	glossary: GlossaryDraft[],
	selectedTerms: string[],
): Record<string, string> {
	const errors: Record<string, string> = {};
	glossary.forEach((entry, index) => {
		const term = entry.term.trim();
		const hasAnyValue = Boolean(term || entry.pronunciation.trim());
		if (hasAnyValue && !term) {
			errors[`glossary-${index}-term`] = "requiredField";
		} else if (term && !selectedTerms.includes(term.toLowerCase())) {
			errors[`glossary-${index}-term`] = "glossarySelectFromDictionary";
		}
	});
	return errors;
}

export function getDuplicateGlossaryTerms(
	glossary: GlossaryDraft[],
): string[] {
	return findDuplicateGlossaryTerms(glossary.map((entry) => entry.term));
}
