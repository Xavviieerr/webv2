"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HISTORY_MAX,
  HISTORY_STORAGE_KEY,
} from "../constants/search";

/**
 * Dictionary search-history persistence.
 * Uses the shared "searchHistory" localStorage key so history stays consistent
 * with other consumers (WordDetailsHeader, oldencyclopedia, MobileSearchDrawer).
 * Preserves the exact prior semantics: case-sensitive dedupe, newest-first,
 * capped at 10 entries.
 */
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  const saveSearchToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const updated = [term, ...prev.filter((h) => h !== term)].slice(
        0,
        HISTORY_MAX,
      );
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((term: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((h) => h !== term);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
  }, []);

  return { searchHistory, saveSearchToHistory, removeFromHistory, clearHistory };
}
