"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "searchHistory";
const MAX_HISTORY = 10;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistHistory(history: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(loadHistory);

  const saveToHistory = useCallback((word: string) => {
    const normalized = word.toLowerCase().trim();
    if (!normalized) return;

    setHistory((prev) => {
      if (prev.includes(normalized)) return prev;

      const next =
        prev.length >= MAX_HISTORY
          ? [normalized, ...prev.slice(0, MAX_HISTORY - 1)]
          : [normalized, ...prev];

      persistHistory(next);
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((word: string) => {
    const normalized = word.toLowerCase().trim();
    if (!normalized) return;

    setHistory((prev) => {
      const next = prev.filter((item) => item !== normalized);
      persistHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persistHistory([]);
  }, []);

  return { history, saveToHistory, removeFromHistory, clearHistory };
}
