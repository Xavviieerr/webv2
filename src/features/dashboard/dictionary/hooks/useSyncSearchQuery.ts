"use client";

import { useEffect } from "react";

import { setSearchQuery } from "@/slice/wordSlice";
import { useAppDispatch } from "@/types/hooks";

/**
 * Syncs the current dictionary term into the global search-query slice so
 * the dictionary header reflects the active word. Pass `enabled={false}`
 * (e.g. embedded editor mode) to skip syncing.
 */
export function useSyncSearchQuery(term: string | null | undefined, enabled = true) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled) return;
    dispatch(setSearchQuery(term ?? ""));
  }, [enabled, term, dispatch]);
}
