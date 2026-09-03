"use client";

import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useLazySearchWordsResultsQuery,
  useLazySearchFiguresListQuery,
  useLazySearchNamesListQuery,
  useLazySearchPlacesListQuery,
} from "../lib/api/searchApi";
import { formatSearchResults } from "../lib/helpers/format-word-search";
import type { MiniFigures, NameRecord } from "@/features/shared/types";
import type { PlaceListItem } from "@/features/dashboard/places/types";

type SearchStateResults = {
  words: SensePacket[];
  names: NameRecord["items"];
  figures: MiniFigures[];
  places: PlaceListItem[];
};

type UseSearchParams = {
  setResults: React.Dispatch<React.SetStateAction<SearchStateResults>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const EMPTY_RESULTS: SearchStateResults = { words: [], names: [], figures: [], places: [] };

export function useSearch({ setResults, setIsLoading, setError }: UseSearchParams) {
  const { t } = useTranslation("common");
  const requestIdRef = useRef(0);

  const [triggerSearchWords] = useLazySearchWordsResultsQuery();
  const [triggerFigures] = useLazySearchFiguresListQuery();
  const [triggerNames] = useLazySearchNamesListQuery();
  const [triggerPlaces] = useLazySearchPlacesListQuery();

  const search = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults(EMPTY_RESULTS);
        setIsLoading(false);
        setError(null);
        return;
      }

      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      setError(null);

      const [wordPartial, wordReverse, figuresResult, namesResult, placesResult] = await Promise.allSettled([
        triggerSearchWords({ q: trimmed, limit: "4" }).unwrap(),
        triggerSearchWords({ q: trimmed, limit: "4", reverse: true }).unwrap(),
        triggerFigures({ search: trimmed, limit: "7" }).unwrap(),
        triggerNames({ search: trimmed, limit: "7" }).unwrap(),
        triggerPlaces({ search: trimmed, limit: "7" }).unwrap(),
      ]);

      if (requestId !== requestIdRef.current) return;

      if (wordPartial.status === "rejected") console.error("[useSearch] wordPartial rejected:", wordPartial.reason);
      if (wordReverse.status === "rejected") console.error("[useSearch] wordReverse rejected:", wordReverse.reason);
      if (figuresResult.status === "rejected") console.error("[useSearch] figures rejected:", figuresResult.reason);
      if (namesResult.status === "rejected") console.error("[useSearch] names rejected:", namesResult.reason);
      if (placesResult.status === "rejected") console.error("[useSearch] places rejected:", placesResult.reason);

      let wordResults: any[] = [];
      if (wordPartial.status === "fulfilled" && Array.isArray(wordPartial.value)) {
        wordResults = [...wordResults, ...wordPartial.value];
      }
      if (wordReverse.status === "fulfilled" && Array.isArray(wordReverse.value)) {
        wordResults = [...wordResults, ...wordReverse.value];
      }

      const figures: MiniFigures[] =
        figuresResult.status === "fulfilled" && Array.isArray(figuresResult.value)
          ? (figuresResult.value as MiniFigures[])
          : [];

      const names: NameRecord["items"] =
        namesResult.status === "fulfilled" && Array.isArray(namesResult.value)
          ? (namesResult.value as NameRecord["items"])
          : [];

      const places: PlaceListItem[] =
        placesResult.status === "fulfilled" && Array.isArray(placesResult.value)
          ? (placesResult.value as PlaceListItem[])
          : [];

      const formattedWords = formatSearchResults(wordResults, trimmed);

      setResults({ words: formattedWords, figures, names, places });
      setIsLoading(false);
    },
    [triggerSearchWords, triggerFigures, triggerNames, triggerPlaces, setResults, setIsLoading, setError, t],
  );

  const clearResults = useCallback(() => {
    setResults(EMPTY_RESULTS);
    setIsLoading(false);
    setError(null);
  }, [setResults, setIsLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return { search, clearResults, clearError };
}
