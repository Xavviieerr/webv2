"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MiniFigures, NameRecord } from "@/features/shared/types";
import type { PlaceListItem } from "@/features/dashboard/places/types";

type Results = {
  words: SensePacket[];
  names: NameRecord["items"];
  figures: MiniFigures[];
  places: PlaceListItem[];
};

type SuggestionItem = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  historyKey?: string;
};

type SuggestionGroup = {
  items: SuggestionItem[];
  type: "words" | "figures" | "names" | "places";
  label: string;
};

export function useSearchSuggestions({
  searchTerm,
  results,
  history,
  showSuggestions,
}: {
  searchTerm: string;
  results: Results;
  history: string[];
  showSuggestions: boolean;
}) {
  const { t } = useTranslation("common");
  const showHistory = showSuggestions && !searchTerm && history.length > 0;

  const suggestionGroups = useMemo<SuggestionGroup[]>(() => {
    if (!showSuggestions || !searchTerm) return [];

    const groups: SuggestionGroup[] = [];

    if (results.words.length > 0) {
      groups.push({
        type: "words",
        label: t("urhoboDictionary"),
        items: results.words.map((w) => ({
          id: w.ota,
          label: w.otaWord ?? w.ota,
          sublabel: w.otaWord ? w.ota : undefined,
          href: w.otaWord
            ? `/search/${encodeURIComponent(w.ota)}?otaWord=${encodeURIComponent(w.otaWord)}`
            : `/search/${encodeURIComponent(w.ota)}`,
          historyKey: w.otaWord ?? w.ota,
        })),
      });
    }

    if (results.figures.length > 0) {
      groups.push({
        type: "figures",
        label: t("historicFigures"),
        items: results.figures.slice(0, 4).map((f) => ({
          id: f.id,
          label: f.fullName,
          sublabel: f.occupation,
          href: `/dashboard/figures/${f.id}`,
        })),
      });
    }

    if (results.names.length > 0) {
      groups.push({
        type: "names",
        label: t("urhoboNames"),
        items: results.names.slice(0, 4).map((n) => ({
          id: n.id,
          label: n.name,
          sublabel:
            n.translations.length > 0
              ? n.translations.map((t) => t.translatedMeaning).join(", ")
              : n.nameType,
          href: `/dashboard/names/${n.id}`,
        })),
      });
    }

    if (results.places.length > 0) {
      groups.push({
        type: "places",
        label: "Places",
        items: results.places.slice(0, 4).map((p) => ({
          id: p.id,
          label: p.name,
          sublabel: p.type,
          href: `/dashboard/places/${p.id}`,
        })),
      });
    }

    return groups;
  }, [searchTerm, results.words, results.figures, results.names, results.places, showSuggestions, t]);

  const showResults = suggestionGroups.length > 0;

  return {
    showSuggestions,
    showHistory,
    showResults,
    suggestionGroups,
  };
}
