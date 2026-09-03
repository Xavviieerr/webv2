"use client";

import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import {
  useLazySearchWordsQuery,
  useLazyAutocompleteQuery,
} from "@/slice/wordEndpoints";
import {
  setSavedQuery,
  setSearchQuery,
  setSearchResults,
} from "@/slice/wordSlice";
import { WordRecord } from "@/slice/wordSlice";
import { transformSearchResponse } from "@/utils/transformSearchResponse";
import { Search, Sparkles, Clock, X } from "lucide-react";
import Link from "next/link";

import ComingSoonModal from "@/components/ComingSoonModal";
import MobileSearchDrawer from "@/components/MobileSearchDrawer";
import { SearchResults } from "./searchResults";
import { AnimatePresence, motion } from "framer-motion";

function SearchPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [fullSearchResults, setFullSearchResults] = useState<WordRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [fetchSearchWords] = useLazySearchWordsQuery();
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const user = useAppSelector((state) => state.auth.user);
  const [suggestions, setSuggestions] = useState<
    { id?: string; word: string; eyuo?: string; photo?: string }[]
  >([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const { searchQuery, savedQuery, error } = useAppSelector(
    (state) => state.word,
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load search history
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  // Save search query
  const saveSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(
      0,
      10,
    );
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter((t) => t !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleSearchChange = (query: string): void => {
    dispatch(setSearchQuery(query));
    if (query.trim()) {
      setShowHistory(false);
    } else {
      setSuggestions([]);
      // Show history when input is cleared
      if (searchHistory.length > 0) setShowHistory(true);
      // Clear search results and reset view when input is cleared
      setFullSearchResults([]);
      setHasSearched(false);
    }
  };

  // Fetch autocomplete suggestions when user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const result = await fetchAutocomplete({ q }).unwrap();
        if (result && typeof result === "object" && "requiresAuth" in result) {
          setShowComingSoonModal(true);
          setSuggestions([]);
          return;
        }
        if (Array.isArray(result)) {
          setSuggestions(result);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchAutocomplete]);

  const handleSuggestionClick = (word: string) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    setShowHistory(false);
    setSuggestions([]);
    dispatch(setSearchQuery(word));
    performSearch(word);
  };

  const performSearch = async (query: string) => {
    if (!query.trim() || !user) {
      if (!user) {
        setShowComingSoonModal(true);
      }
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    saveSearchToHistory(query);
    setShowHistory(false);
    dispatch(setSavedQuery(query));

    try {
      const response = await fetchSearchWords({
        q: query.trim(),
        mode: "partial",
        lang: "urhobo",
        limit: 50,
        reverse: true,
      }).unwrap();

      const transformed = transformSearchResponse(response, "urhobo");
      setFullSearchResults(transformed.records || []);
    } catch (err) {
      console.error("Search error:", err);
      setFullSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      performSearch(searchQuery);
    }
  };

  const handleHistoryClick = (term: string) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    setShowHistory(false);
    dispatch(setSearchQuery(term));
    performSearch(term);
  };

  const handleFocus = () => {
    // On mobile, open drawer instead of showing inline history
    if (isMobile) {
      setShowMobileDrawer(true);
      return;
    }
    if (!searchQuery.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleBlur = () => {
    if (!isMobile) {
      setTimeout(() => setShowHistory(false), 200);
    }
  };

  const handleMobileInputClick = () => {
    if (isMobile) {
      setShowMobileDrawer(true);
    }
  };

  return (
    <div className="relative">
      {/* Background decorative elements - behind content, no pointer events */}
      <div className="absolute top-0 left-0 hidden md:block z-0 pointer-events-none">
        <svg
          width="482"
          height="673"
          viewBox="0 0 482 673"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_40002721_7797)">
            <rect
              width="205.387"
              height="693.046"
              transform="matrix(0.379522 -0.925183 0.636469 0.771303 -238 -61.5479)"
              fill="#0E808D40"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_40002721_7797"
              x="-438"
              y="-451.568"
              width="919.051"
              height="1124.57"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_40002721_7797"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute top-[-100px] left-0 hidden md:block z-0 pointer-events-none">
        <svg
          width="767"
          height="673"
          viewBox="0 0 767 673"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_40002721_7799)">
            <rect
              width="205.387"
              height="693.046"
              transform="matrix(0.379522 -0.925183 0.636469 0.771303 47.5753 -61.5479)"
              fill="#23D8EC50"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_40002721_7799"
              x="-152.425"
              y="-451.568"
              width="919.051"
              height="1124.57"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_40002721_7799"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-fit hidden md:block z-0 pointer-events-none">
        <svg
          width="539"
          height="620"
          viewBox="0 0 539 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_40002721_7801)">
            <rect
              x="200"
              y="-314"
              width="138.462"
              height="734"
              fill="#E2BC7450"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_40002721_7801"
              x="0"
              y="-514"
              width="538.462"
              height="1134"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_40002721_7801"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute top-[-70px] right-0 w-fit hidden md:block z-0 pointer-events-none">
        <svg
          width="790"
          height="513"
          viewBox="0 0 790 513"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_40002721_7800)">
            <ellipse
              cx="300.326"
              cy="106.97"
              rx="300.326"
              ry="106.97"
              transform="matrix(0.80718 -0.590306 0.638497 0.769624 141.202 211.568)"
              fill="#B3832940"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_40002721_7800"
              x="0"
              y="-278.902"
              width="903.838"
              height="791.027"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_40002721_7800"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-fit hidden md:block z-0 pointer-events-none">
        <svg
          width="538"
          height="673"
          viewBox="0 0 538 673"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_40002721_7798)">
            <rect
              width="205.387"
              height="693.046"
              transform="matrix(-0.379522 -0.925183 -0.636469 0.771303 719.051 -61.5479)"
              fill="#1EBDCE40"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_40002721_7798"
              x="0"
              y="-451.568"
              width="919.051"
              height="1124.57"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_40002721_7798"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Main content above background - receives clicks */}
      <div className="relative z-10">
        {hasSearched ? (
          /* Search Results View */
          <SearchResults
            results={fullSearchResults}
            searchQuery={searchQuery}
            savedQuery={savedQuery}
            onSearch={performSearch}
            isSearching={isSearching}
          />
        ) : (
          /* Home View */
          <div className="flex flex-col items-center justify-center w-full mx-auto min-h-[calc(100vh-80px)] px-4 sm:px-6 -mt-12">
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/">
                <Image
                  src="/guono-home-search-logo.svg"
                  alt="Guọnọ logo"
                  width={100}
                  height={25}
                  aria-label="Guọnọ logo"
                  className="w-[240px] h-auto lg:w-full"
                />
              </Link>
            </motion.div>

            <motion.div
              className="w-full max-w-[891px] mx-auto mt-10 px-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex flex-col gap-3">
                {/* Card: search + button; stacked on mobile, row on larger screens */}
                <div className="bg-[#F2FEFF] flex items-center justify-center rounded-2xl min-h-[78px] sm:h-[78px] px-3 sm:px-4 py-3 sm:py-0 shadow-md transition-shadow outline-none focus-within:ring-offset-0">
                  {/* inner div: responsive layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 w-full rounded-xl outline-none focus-within:outline-2 focus-within:outline-[#0E808D] focus-within:outline-offset-1 bg-[#F2FEFF] p-2">
                    <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-3">
                      <Search className="w-5 h-5 shrink-0 text-gray-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        id="search"
                        autoComplete="off"
                        placeholder={t("searchGuono")}
                        className="flex-1 min-w-0 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400 focus:outline-none"
                        value={isMobile ? "" : searchQuery}
                        onFocus={handleFocus}
                        onClick={handleMobileInputClick}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          if (!isMobile) handleSearchChange(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        readOnly={isMobile}
                      />
                      {searchQuery && !isMobile && (
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setSearchQuery(""));
                            dispatch(setSearchResults([]));
                            setSuggestions([]);
                            if (searchHistory.length > 0) setShowHistory(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                          aria-label="Clear search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!searchQuery.trim()) return;
                        performSearch(searchQuery);
                      }}
                      disabled={isSearching}
                      className="flex items-center justify-center gap-2 rounded-[10px] bg-[#02474F] text-white font-medium px-4 py-3 sm:px-8 sm:py-4 w-full sm:w-auto shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-5 h-5 shrink-0" />
                      <span className="uppercase text-sm tracking-wide">
                        {isSearching ? t("loading") : "Search"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Autocomplete suggestions dropdown - when user types */}
                {!isMobile && searchQuery.trim() !== "" && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden z-40 max-h-[280px] overflow-y-auto">
                    {suggestionsLoading ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        {t("loading") || "Loading..."}
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="py-2">
                        {suggestions.map((item, index) => (
                          <li key={item.id ?? index}>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(item.word);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                            >
                              <Search className="w-4 h-4 shrink-0 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {item.word}
                              </span>
                              {item.eyuo && (
                                <>
                                  <span className="w-px h-3 bg-gray-200" />
                                  <span className="text-sm text-gray-600">
                                    {item.eyuo}
                                  </span>
                                </>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}

                {/* Search History - Desktop: white card below search, clock icon + text, separators */}
                {!isMobile && showHistory && searchHistory.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden z-40">
                    {searchHistory.slice(0, 3).map((term, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 first:bg-gray-50 cursor-pointer transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleHistoryClick(term);
                        }}
                      >
                        <Clock className="w-5 h-5 shrink-0 text-gray-400" />
                        <span className="flex-1 text-gray-600">{term}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeFromHistory(term, e);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                          aria-label="Remove from history"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error}
                </div>
              )}
            </motion.div>

            {/* Mobile Search Drawer */}
            <AnimatePresence>
              {showMobileDrawer && (
                <MobileSearchDrawer
                  isOpen={showMobileDrawer}
                  onClose={() => setShowMobileDrawer(false)}
                  onPerformSearch={performSearch}
                  showKeyboard={false}
                  setShowKeyboard={() => {}}
                />
              )}
            </AnimatePresence>

            {showComingSoonModal && (
              <ComingSoonModal
                closeModal={() => setShowComingSoonModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
