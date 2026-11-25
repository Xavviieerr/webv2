import { z } from "zod";
import { FOLKTALE_TYPES } from "../types/folktales";

export const folktaleStoryDraftSchema = z.object({
	title: z.string().trim().min(1, "requiredField"),
	summary: z.string().trim().min(1, "requiredField"),
	body: z.string().trim().min(1, "requiredField"),
	type: z
		.string()
		.min(1, "requiredField")
		.refine(
			(value) => (FOLKTALE_TYPES as readonly string[]).includes(value),
			"requiredField",
		),
});

export type FolktaleStoryDraft = z.infer<typeof folktaleStoryDraftSchema>;

/**
 * Scene markers are added by editors after a story is submitted. Contributors
 * must not include them, so flag any `{{...}}` token (or a stray brace) before
 * the API rejects the payload with "Malformed illustration markers".
 */
export function findStoryMarker(body: string): string | null {
	const match = body.match(/\{\{[^}]*\}\}/);
	if (match) return match[0];
	if (body.includes("{{")) return "{{";
	if (body.includes("}}")) return "}}";
	return null;
}

export function findDuplicateGlossaryTerms(terms: string[]): string[] {
	const seen = new Map<string, number>();
	const duplicates = new Set<string>();

	for (const raw of terms) {
		const term = raw.trim().toLowerCase();
		if (!term) continue;
		const count = (seen.get(term) ?? 0) + 1;
		seen.set(term, count);
		if (count > 1) duplicates.add(term);
	}

	return [...duplicates];
}
