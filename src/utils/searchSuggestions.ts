/**
 * Shared search-suggestion grouping used by both the platform search bar
 * (MobileSearchDrawer) and the Dictionary feature. The input is structurally
 * typed so that either feature's autocomplete shape satisfies it.
 */

/** Minimal autocomplete item shape consumed by grouping. */
export interface SearchSuggestionSource {
  word: string;
  eyuo?: string;
  eyuoEng?: string[];
  eyuoKor?: string;
}

/** Display model for a search suggestion row (primary label + captions). */
export interface SearchSuggestionItem {
  label: string;
  captions: string[];
}

/**
 * Matches autocomplete suggestions against the query and groups them for
 * display: primary label (in the search language) with captions for the
 * related values.
 */
export function groupSearchSuggestions(
  suggestions: SearchSuggestionSource[],
  query: string,
): SearchSuggestionItem[] {
  const q = query.trim().toLowerCase();

  const matchedSuggestions = suggestions
    .map((item) => {
      if (item.word.toLowerCase().trim().startsWith(q))
        return { label: item.word, captions: [...(item.eyuoEng ?? "")] };

      if (item.eyuoKor?.toLowerCase().trim().startsWith(q))
        return { label: item.eyuoKor, captions: [item.word ?? ""] };

      const matchedEng = item.eyuoEng?.find((entry) =>
        entry.toLowerCase().trim().startsWith(q),
      );
      if (matchedEng)
        return { label: matchedEng, captions: [item.word ?? ""] };

      return undefined;
    })
    .filter((item): item is SearchSuggestionItem => item !== undefined);

  if (!matchedSuggestions || matchedSuggestions.length === 0) return [];

  const map = new Map<string, string[]>();
  for (const item of matchedSuggestions) {
    if (!map.has(item.label)) {
      map.set(item.label, []);
    }
    map.get(item.label)!.push(...item.captions);
  }

  return Array.from(map.entries()).map(([label, captions]) => ({
    label,
    captions,
  }));
}
