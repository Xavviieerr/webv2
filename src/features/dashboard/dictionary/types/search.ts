/**
 * Search-domain types for the dictionary feature.
 * Shared between the autocomplete data hook, the pure suggestion grouping
 * utility, and the presentational suggestions list.
 */

/** Raw autocomplete item returned by the suggestions endpoint. */
export interface AutocompleteSuggestion {
  id?: string;
  word: string;
  eyuo?: string;
  eyuoEng?: string[];
  eyuoKor?: string;
  photo?: string;
}

export type { SearchSuggestionItem } from "@/utils/searchSuggestions";
