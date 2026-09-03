"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WordRecord } from "@/slice/wordSlice";
import WordDisplay from "./wordDisplay";
import { GenericSearchComponent } from "@/features/dashboard/dictionary/components/genericSearchComponent";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", labelKey: "all" },
  { id: "dictionary_word", labelKey: "dictionaryWord" },
  { id: "music", labelKey: "music" },
  { id: "names", labelKey: "urhoboNames" },
  { id: "sport", labelKey: "filterSport" },
  { id: "historical_figure", labelKey: "historicalFigure" },
  { id: "cultural_practice", labelKey: "culturalPractice" },
  { id: "lyrics", labelKey: "lyrics" },
  { id: "places", labelKey: "places" },
  { id: "proverbs_idioms", labelKey: "proverbsAndIdioms" },
  { id: "folk_tales", labelKey: "filterFolktales" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface SearchResultsProps {
  results: WordRecord[];
  searchQuery: string;
  savedQuery: string;
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  savedQuery,
  onSearch,
  isSearching = false,
}) => {
  const { t } = useTranslation("common");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  // For now only dictionary_word category has data; others show empty
  const filteredResults =
    activeCategory === "all" || activeCategory === "dictionary_word"
      ? results
      : [];

  const showCategoryNotFound =
    activeCategory !== "all" && activeCategory !== "dictionary_word";

  // Match if search term is in main word or in any translation (en, urh, kor)
  const isSearchTermInRecord = (record: WordRecord, q: string): boolean => {
    if (!q) return false;
    const main = (record.word ?? "").trim().toLowerCase();
    if (main === q) return true;
    const enWords = (record.translations?.en ?? []).map((t) =>
      (t.word ?? "").trim().toLowerCase(),
    );
    const urhWords = (record.translations?.urh ?? []).map((t) =>
      (t.word ?? "").trim().toLowerCase(),
    );
    const korWords = (record.translations?.kor ?? []).map((t) =>
      (t.word ?? "").trim().toLowerCase(),
    );
    const allWords = [...enWords, ...urhWords, ...korWords];
    return allWords.includes(q);
  };

  const queryNormalized = savedQuery.trim().toLowerCase();
  const searchTermInResults =
    queryNormalized !== "" &&
    filteredResults.some((r) => isSearchTermInRecord(r, queryNormalized));

  const hasResultsButWordNotFound =
    !isSearching &&
    !showCategoryNotFound &&
    filteredResults.length > 0 &&
    !searchTermInResults;

  const didYouMean = useMemo(() => {
    if (filteredResults.length == 0 || searchTermInResults) return [];

    const matches = filteredResults.filter((entry) => {
      if (entry.word === savedQuery) return false;
      if (entry.translations?.en?.some((t) => t.word === savedQuery))
        return false;
      if (entry.translations?.kor?.some((t) => t.word === savedQuery))
        return false;

      if (entry.word.includes(savedQuery) || savedQuery.includes(entry.word))
        return true;
      if (
        entry.translations?.en?.some(
          (t) => t.word.includes(savedQuery) || savedQuery.includes(t.word),
        )
      )
        return true;
      if (
        entry.translations?.kor?.some(
          (t) => t.word.includes(savedQuery) || savedQuery.includes(t.word),
        )
      )
        return true;

      return false;
    });
    return matches;
  }, [filteredResults]);

  const getClosestWord = (item: WordRecord) => {
    const main = item.word;
    const enWords = item.translations?.en?.map((t) => t.word) ?? [];
    const korWords = item.translations?.kor?.map((t) => t.word) ?? [];

    const allWords = [main, ...enWords, ...korWords];

    const closestWord = allWords.find(
      (word) =>
        word.toLowerCase() === savedQuery.toLowerCase() ||
        word.toLowerCase().includes(savedQuery.toLowerCase()) ||
        savedQuery.toLowerCase().includes(word.toLowerCase()),
    );

    return closestWord ? closestWord : item.word;
  };

  return (
    <div className="flex w-full min-h-screen  py-4 sm:py-6 md:py-8">
      <div className="flex justify-center w-full pt-5 fixed left-0 top-16 z-100 bg-backg">
        <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-2xl mx-auto px-2 sm:px-4">
          <GenericSearchComponent
            onSearchOnly={onSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-16">
        {/* Category Tabs - horizontal scroll on mobile */}
        <div
          className="flex gap-2 mb-4 sm:mb-6 md:mb-8 max-lg:max-w-[calc(100vw-10px)] w-full overflow-x-scroll pb-2 max-md:pt-3 -mx-1 px-1 no-scrollbar md:custom-scrollbar"
          role="tablist"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveCategory(cat.id);
              }}
              className={`cursor-pointer select-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors border shrink-0 ${
                activeCategory === cat.id
                  ? "bg-[#0F5B61] text-white border-[#0F5B61]"
                  : "bg-[#F0F0F0] text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
            {t("loading")}
          </div>
        )}

        {/* Category not found (other than Dictionary Word / All) */}
        {!isSearching && showCategoryNotFound && (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            {t("notFound")} — {t("noResultsFound")} {t("inThisCategory")}
          </div>
        )}

        {/* Did You Mean - show only when no search results */}
        {!isSearching &&
          !showCategoryNotFound &&
          searchQuery &&
          didYouMean.length > 0 && (
            <div className="flex flex-col w-full items-start gap-4 text-sm sm:text-base">
              <p className="flex shrink-0">{t("didYouMean")}</p>

              <div className="flex flex-wrap items-center gap-2 ">
                {didYouMean.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`?q=${getClosestWord(entry)}`}
                    className="px-5 py-3 border border-dashed rounded-full border-primary/50 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {getClosestWord(entry)}
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* No Results for search term (empty response or word not in response) */}
        {/* !isSearching && !showCategoryNotFound && searchQuery && (results.length === 0 || hasResultsButWordNotFound) &&  */}
        {!isSearching &&
          !showCategoryNotFound &&
          searchQuery &&
          (results.length == 0 || hasResultsButWordNotFound) && (
            <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
              {t("noResultsFoundFor")} &quot;{searchQuery}&quot;
            </div>
          )}

        {/* Dictionary word results: render only when the searched word is in the response */}
        {/* !isSearching && filteredResults.length > 0 && searchTermInResults &&  */}
        {!isSearching && filteredResults.length > 0 && searchTermInResults && (
          <WordDisplay
            embedded={{ records: filteredResults, term: savedQuery }}
          />
        )}
      </div>
    </div>
  );
};
