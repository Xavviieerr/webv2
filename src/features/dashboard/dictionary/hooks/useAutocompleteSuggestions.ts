"use client";

import { useEffect, useMemo, useState } from "react";
import { useLazyAutocompleteQuery } from "@/slice/wordEndpoints";
import { groupSearchSuggestions } from "../utils/searchSuggestions";
import { AUTOCOMPLETE_DEBOUNCE_MS } from "../constants/search";
import type {
  AutocompleteSuggestion,
  SearchSuggestionItem,
} from "../types/search";

interface UseAutocompleteSuggestionsParams {
  searchQuery: string;
  /** Invoked when the endpoint reports the feature requires authentication. */
  onRequiresAuth: () => void;
}

/**
 * Autocomplete suggestions for the search bar: fetches as `searchQuery`
 * changes (200ms debounce) and groups the matches for display. Owns the raw
 * suggestion list + loading flag; the grouped display model is derived.
 */
export function useAutocompleteSuggestions({
  searchQuery,
  onRequiresAuth,
}: UseAutocompleteSuggestionsParams) {
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const result = await fetchAutocomplete({ q }).unwrap();
        if (result && typeof result === "object" && "requiresAuth" in result) {
          onRequiresAuth();
          setSuggestions([]);
          return;
        }
        if (Array.isArray(result)) {
          setSuggestions(result as AutocompleteSuggestion[]);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchAutocomplete, onRequiresAuth]);

  const searchSuggestions = useMemo<SearchSuggestionItem[]>(
    () => groupSearchSuggestions(suggestions, searchQuery),
    [suggestions, searchQuery],
  );

  const clearSuggestions = () => setSuggestions([]);

  return {
    suggestionsLoading,
    searchSuggestions,
    clearSuggestions,
  };
}
