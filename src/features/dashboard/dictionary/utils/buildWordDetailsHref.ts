import {
  WORD_DETAILS_ROUTE,
  WORD_TERM_PARAM,
  WORD_REVERSE_PARAM,
  WORD_ID_PARAM,
} from "../constants/search";

/**
 * Builds the word-details page href for a term, optionally forcing a
 * reverse=true lookup. Single owner for the dictionary route + query keys.
 */
export function buildWordDetailsHref(term: string, reverse?: boolean, wordId?: string): string {
  const params = new URLSearchParams();
  params.set(WORD_TERM_PARAM, term.trim());
  if (reverse) params.set(WORD_REVERSE_PARAM, "true");
  if (wordId) params.set(WORD_ID_PARAM, wordId);
  return `${WORD_DETAILS_ROUTE}?${params.toString()}`;
}
