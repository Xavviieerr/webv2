"use client";

import { useEffect, useState } from "react";
import { session } from "@/features/auth/services/session";
import { fetchWordsToReview } from "../api/wordsToReview";
import type { NewlyAddedWord } from "../types/word";

export type { NewlyAddedWord } from "../types/word";

/**
 * Fetches words pending review and ratings from
 * GET /word/to-review-and-ratings (Bearer token from session storage).
 * Preserves the prior component behavior: no query params, session-token auth,
 * and silent error handling (loads empty list on failure).
 */
export function useNewlyAddedWords() {
  const [words, setWords] = useState<NewlyAddedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { accessToken } = session.loadTokens();
    if (!accessToken) return;

    let cancelled = false;

    const fetchNewWords = async () => {
      setIsLoading(true);
      try {
        const result = await fetchWordsToReview(accessToken);
        if (!cancelled) setWords(result);
      } catch {
        // silent — preserves current behavior
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchNewWords();

    return () => {
      cancelled = true;
    };
  }, []);

  return { words, isLoading };
}