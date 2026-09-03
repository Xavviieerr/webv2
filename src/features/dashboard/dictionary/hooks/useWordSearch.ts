"use client";

import { useRouter } from "next/navigation";

import { buildWordDetailsHref } from "../utils/buildWordDetailsHref";

/**
 * Navigation helper for the dictionary feature: opens the word-details page
 * for the given term, optionally forcing a reverse=true lookup.
 */
export function useWordSearch() {
  const router = useRouter();

  const openWordDetails = (term: string, reverse?: boolean, wordId?: string) => {
    router.push(buildWordDetailsHref(term, reverse, wordId));
  };

  return { openWordDetails };
}