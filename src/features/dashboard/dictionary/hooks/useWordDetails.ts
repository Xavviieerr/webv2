"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyGetWordDetailsQuery, useLazyWordByIdQuery } from "@/slice/wordEndpoints";
import { WordRecord } from "@/types/word";
import { useSyncSearchQuery } from "./useSyncSearchQuery";
import { WORD_ID_PARAM } from "../constants/search";

export interface WordDetailsEmbeddedProps {
  records: WordRecord[];
  term: string;
  reverse?: boolean;
}

/**
 * Data layer for the word details page:
 * - resolves the active term/reverse from embedded props or the URL
 * - fetches word details on term/reverse change
 * - when search returns no records but a wordId is in the URL, falls back to
 *   the wordById endpoint (used for newly coined/added words not yet in search)
 * - triggers a reverse=true fallback when an English/Korean (reverse=false)
 *   lookup returns nothing, before deciding "word not found"
 * - keeps the Redux search query in sync for the generic search bar
 */
export function useWordDetails(embedded?: WordDetailsEmbeddedProps) {
  const searchParams = useSearchParams();
  const termFromUrl = searchParams.get("term") || "";
  const reverseFromUrl = searchParams.get("reverse") === "true";
  const wordIdFromUrl = searchParams.get(WORD_ID_PARAM) || "";
  const term = (embedded ? embedded.term : termFromUrl).trim();
  const reverse = embedded ? (embedded.reverse ?? true) : reverseFromUrl;
  const embeddedWordId = embedded ? "" : wordIdFromUrl;

  const [fetchWordDetails, { data: fetchedData, isLoading }] =
    useLazyGetWordDetailsQuery();
  const [fetchWordById, { data: wordByIdData, isLoading: wordByIdLoading }] =
    useLazyWordByIdQuery();
  const [hasTriedReverseFallback, setHasTriedReverseFallback] = useState(false);
  const [hasTriedWordById, setHasTriedWordById] = useState(false);

  const data = embedded ? { records: embedded.records } : fetchedData;

  // Keep the Redux search query in sync so the generic search bar shows the current term
  useSyncSearchQuery(term, !embedded);

  useEffect(() => {
    if (!embedded && term) {
      fetchWordDetails({ term, language: "urhobo", reverse });
    }
  }, [embedded, term, reverse, fetchWordDetails]);

  // If we searched by English/Korean (reverse=false) and got no records, try a
  // reverse=true lookup before declaring "word not found", so we can render the
  // Urhobo entry when it exists.
  useEffect(() => {
    if (embedded || !term || isLoading || hasTriedReverseFallback) return;
    if (reverse) return; // already reverse lookup

    const records =
      (fetchedData as { records?: WordRecord[] } | undefined)?.records ?? [];
    if (records.length === 0) {
      setHasTriedReverseFallback(true);
      fetchWordDetails({ term, language: "urhobo", reverse: true });
    }
  }, [
    embedded,
    term,
    reverse,
    isLoading,
    fetchedData,
    hasTriedReverseFallback,
    fetchWordDetails,
  ]);

  // Fallback: if search returned no records but we have a wordId in the URL
  // (e.g. newly coined/added words not yet indexed in search), fetch by ID.
  useEffect(() => {
    if (embedded || !embeddedWordId || hasTriedWordById) return;
    if (isLoading) return;

    const searchRecords =
      (fetchedData as { records?: WordRecord[] } | undefined)?.records ?? [];

    // Only try wordById if search returned nothing (and reverse fallback already tried or not needed)
    if (searchRecords.length === 0 && (reverse || hasTriedReverseFallback)) {
      setHasTriedWordById(true);
      fetchWordById(embeddedWordId);
    }
  }, [
    embedded,
    embeddedWordId,
    isLoading,
    fetchedData,
    reverse,
    hasTriedReverseFallback,
    hasTriedWordById,
    fetchWordById,
  ]);

  // Reset fallback flags when term or embedded mode changes
  useEffect(() => {
    setHasTriedReverseFallback(false);
    setHasTriedWordById(false);
  }, [term, embedded]);

  // If wordById returned data, merge it as a record
  const wordByIdRecord = wordByIdData as WordRecord | undefined;
  const mergedData = (() => {
    if (embedded) return embedded ? { records: embedded.records } : fetchedData;

    // If wordById returned something and search had no records, use wordById result
    if (wordByIdRecord && wordByIdRecord.word) {
      const searchRecords =
        (fetchedData as { records?: WordRecord[] } | undefined)?.records ?? [];
      if (searchRecords.length === 0) {
        return { records: [wordByIdRecord] };
      }
    }

    return fetchedData;
  })();

  // Determine the effective wordId: prefer URL param, fallback to first search result's id
  const searchRecords =
    (mergedData as { records?: WordRecord[] } | undefined)?.records ?? [];
  const recordWordId = searchRecords.length > 0 ? String(searchRecords[0].id || "") : "";
  const effectiveWordId = embeddedWordId || recordWordId;

  return {
    term,
    reverse,
    data: mergedData,
    isLoading: isLoading || (embeddedWordId && !hasTriedWordById && wordByIdLoading),
    hasTriedReverseFallback,
    wordId: effectiveWordId,
  };
}