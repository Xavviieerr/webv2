"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Search, Clock, X } from "lucide-react";
import { useContributorAccess } from "@/features/guonopedia/contributors";
import { useSearch } from "@/features/search/hooks/use-search";
import { useSearchSuggestions } from "@/features/search/hooks/use-search-suggestions";
import { useSearchHistoryCtx } from "@/features/search/lib/search-history-context";
import type { MiniFigures, NameRecord } from "@/features/shared/types";
import { IconChevronRight } from "@tabler/icons-react";
import { IconArrowRight } from "@tabler/icons-react";
import { FeaturedContent } from "@/features/dashboard/home";
import { ClassesPromoCard } from "@/features/classes";
import { FEATURED_SECTION_BG } from "@/features/dashboard/home/constants/featured";
import { guonopediaCategories } from "./constants/categories";
import { useWordCountTotalQuery } from "@/slice/wordEndpoints";
import { useNameCountTotalQuery, useFigureCountTotalQuery } from "@/features/search/lib/api/searchApi";
import { usePlaceCountTotalQuery } from "@/features/dashboard/places/api/placeEndpoints";

type SuggestionItem = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  historyKey?: string;
};

type SearchStateResults = {
  words: SensePacket[];
  figures: MiniFigures[];
  names: NameRecord["items"];
  places: import("@/features/dashboard/places/types").PlaceListItem[];
};

const EMPTY_RESULTS: SearchStateResults = {
  words: [],
  figures: [],
  names: [],
  places: [],
};

export function GuonopediaLanding() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { hasApplication, applyHref, hubHref } = useContributorAccess();

  const contributorCta = hasApplication
    ? { href: hubHref, label: t("viewApplicationStatus") }
    : { href: applyHref, label: t("applyToBeContributor") };

  const { data: wordCountData } = useWordCountTotalQuery();
  const { data: nameCountData } = useNameCountTotalQuery();
  const { data: figureCountData } = useFigureCountTotalQuery();
  const { data: placeCountData } = usePlaceCountTotalQuery();

  const countMap: Record<string, number> = {
    entries: wordCountData?.data ?? 0,
    names: nameCountData?.data ?? 0,
    figures: figureCountData?.data ?? 0,
    placesCount: placeCountData?.data ?? 0,
  };

  const formatCount = (count: number, label: string) => {
    if (count === 0) return "";
    return `${count.toLocaleString()}+ ${label}`;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchStateResults>(EMPTY_RESULTS);

  const { history, saveToHistory, removeFromHistory, clearHistory } = useSearchHistoryCtx();

  const { search: performSearch, clearResults, clearError } = useSearch({
    setResults,
    setIsLoading,
    setError,
  });

  const { showHistory, suggestionGroups } = useSearchSuggestions({
    searchTerm,
    results,
    history,
    showSuggestions,
  });

  const debounceRef = useRef<number | null>(null);
  const lastSearchedRef = useRef<string>("");

  const navigateToWord = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      router.push(`/guonopedia/search/${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) return;
    debounceRef.current = window.setTimeout(() => {
      performSearch(searchTerm);
    }, 500);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm, performSearch]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    if (!value.trim()) {
      lastSearchedRef.current = "";
      clearResults();
    }
  };

  const handleEnter = () => {
    if (!searchTerm.trim()) return;
    navigateToWord(searchTerm);
  };

  const handleSuggestionSelect = (item: SuggestionItem) => {
    saveToHistory(item.historyKey ?? item.id);
    navigateToWord(item.label);
  };

  const handleHistorySelect = (word: string) => {
    navigateToWord(word);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Title */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0D4D4D]">
          {t("guonopedia")}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
          {t("guonopediaDescription")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-2xl">
          <Search
            strokeWidth={1.3}
            size={18}
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600 z-10"
          />
          <input
            type="text"
            placeholder={t("searchGuono")}
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleEnter();
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="py-3 pl-11 pr-4 w-full outline-none rounded-full bg-backg text-gray-700 placeholder:capitalize border border-secondary-foreground/30"
          />

          {/* Suggestion Dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-xl shadow-lg border border-gray-300 bg-backg z-50 max-h-80 overflow-y-scroll custom-scrollbar">
              {showHistory && history.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center justify-between px-2 mb-1">
                    <p className="text-xs text-slate-600/70 underline underline-offset-3">
                      {t("recentSearches")}
                    </p>
                    {history.length > 0 && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          clearHistory();
                        }}
                        className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors underline underline-offset-2"
                      >
                        {t("clearAll", "Clear all")}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col">
                    {history.map((word) => (
                      <div
                        key={word}
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-secondary-foreground/10 group"
                      >
                        <button
                          type="button"
                          onMouseDown={() => handleHistorySelect(word)}
                          className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                        >
                          <Clock
                            strokeWidth={1.2}
                            className="text-gray-400 mr-1"
                            size={15}
                          />
                          <span className="font-medium text-gray-600 lowercase">
                            {word}
                          </span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            removeFromHistory(word);
                          }}
                          className="cursor-pointer hover:text-red-500 transition-colors shrink-0"
                        >
                          <X strokeWidth={1.5} size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!showHistory && suggestionGroups.length > 0 && (
                <div className="flex flex-col gap-3 p-3">
                  {suggestionGroups.map((group) => (
                    <div key={group.type} className="flex flex-col">
                      <p className="text-xs text-slate-600/70 underline underline-offset-3 px-2 mb-1">
                        {group.label}
                      </p>
                      <div className="flex flex-col">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onMouseDown={() => handleSuggestionSelect(item)}
                            className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-secondary-foreground/10 text-left cursor-pointer"
                          >
                            <Search
                              strokeWidth={1.2}
                              className="text-gray-400 mr-1 shrink-0"
                              size={15}
                            />
                            <span className="font-medium text-gray-700 lowercase">
                              {item.label}
                            </span>
                            {item.sublabel && (
                              <span className="text-xs text-gray-500 truncate">
                                - {item.sublabel}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showHistory && suggestionGroups.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  {t("typeToSearch")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-[#0D4D4D] mb-4">
          {t("exploreCategories")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {guonopediaCategories.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  if (item.isReady && item.href) {
                    router.push(item.href);
                  }
                }}
                className={`group bg-[#D4E8EA] rounded-xl p-4 sm:p-5 transition-all duration-200 border border-transparent ${
                  item.isReady
                    ? "hover:shadow-lg hover:border-gray-100 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-base font-medium text-[#0D4D4D] group-hover:text-[#1A4349] transition-colors">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(item.descriptionKey)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    {item.isReady ? (
                      <>
                        {item.countLabel && countMap[item.countLabel] > 0 && (
                          <span className="text-xs font-medium text-[#0D4D4D]/50">
                            {formatCount(countMap[item.countLabel], t(item.countLabel))}
                          </span>
                        )}
                        <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all ml-auto" />
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        {t("comingSoon")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Urhobo classes */}
      <div className="mb-10 max-w-md">
        <ClassesPromoCard />
      </div>

      {/* Featured Content */}
      <FeaturedContent />

      {/* Apply to contribute */}
      <div className="mt-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold text-[#0D4D4D] mb-3">
          {t("contributeToEncyclopedia")}
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          {t("contributorProgramDescription")}
        </p>
        <Link
          href={contributorCta.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: FEATURED_SECTION_BG }}
        >
          {contributorCta.label}
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
