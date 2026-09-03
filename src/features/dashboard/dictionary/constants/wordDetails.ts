/** Domain constants for the word-details page and its sections. */

/** Dialect label treated as the standard Urhobo dialect (header badge logic). */
export const STANDARD_DIALECT = "Agbarho";

export const LANGUAGE_OPTIONS = [
	{ value: "urhobo", label: "Urhobo" },
	{ value: "en", label: "English" },
	{ value: "kor", label: "Korean" },
] as const;

export type DictionaryLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const REVIEWS_PAGE_SIZE = 1;

export const REVIEW_SORT_OPTIONS = [
	{ value: "newest", label: "Sort by newest review" },
	{ value: "oldest", label: "Sort by oldest review" },
	{ value: "highest", label: "Sort by highest rating" },
	{ value: "lowest", label: "Sort by lowest rating" },
] as const;

export type ReviewSortOption = (typeof REVIEW_SORT_OPTIONS)[number]["value"];
