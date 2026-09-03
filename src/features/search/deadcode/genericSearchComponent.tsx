"use client";

import React, {
  useEffect,
  useState,
  KeyboardEvent,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import {
  useLazySearchWordsQuery,
  useLazyWordOfDayQuery,
  useLazyAutocompleteQuery,
} from "@/slice/wordEndpoints";
import { setSearchQuery, setSearchResults } from "@/slice/wordSlice";
import { WordRecord } from "@/slice/wordSlice";
import { transformSearchResponse } from "@/utils/transformSearchResponse";
import { Search, Clock, X, Keyboard, Share2 } from "lucide-react";
import ComingSoonModal from "@/components/ComingSoonModal";
import MobileSearchDrawer from "@/components/MobileSearchDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { KeyboardURH } from "@/features/shared";
import { useKeyboardListNavigation } from "@/hooks/useKeyboardListNavigator";
import { SearchResults } from "./searchResults";
import { useDebounce } from "@/hooks/useDebounce";

interface GenericSearchComponentProps {
  initialQuery?: string;
  onSearchStart?: () => void;
  onSearchComplete?: (results: WordRecord[], query: string) => void;
  /** When "searchBarOnly", only the search bar is shown (no word of day, result tag, history). */
  variant?: "full" | "searchBarOnly";
  /** When set, search is delegated to parent (no internal fetch); used when embedded in results page. */
  onSearchOnly?: (query: string) => void;
}

export const GenericSearchComponent = ({
  initialQuery,
  onSearchStart,
  onSearchComplete,
  variant = "full",
  onSearchOnly,
}: GenericSearchComponentProps = {}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [fullSearchResults, setFullSearchResults] = useState<WordRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showMobileKeyboard, setShowMobileKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const initialQueryRun = useRef(false);

  const [fetchSearchWords] = useLazySearchWordsQuery();
  const [fetchWordOfDay] = useLazyWordOfDayQuery();
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const user = useAppSelector((state) => state.auth.user);
  const { searchQuery, error } = useAppSelector((state) => state.word);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [wordOfDayData, setWordOfDayData] = useState<{
    word: string;
    meaning?: string;
    photo?: { url: string; type: string };
    photoUrl?: string;
  } | null>(null);
  const [showWordOfDayImage, setShowWordOfDayImage] = useState(false);
  const [suggestions, setSuggestions] = useState<
    {
      id?: string;
      word: string;
      eyuo?: string;
      eyuoEng?: string[];
      eyuoKor?: string;
      photo?: string;
    }[]
  >([]);

  /** True if string contains Hangul (Korean). */
  const hasHangul = (s: string) => /[\uAC00-\uD7AF]/.test(s);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  /** When searchBarOnly: only show suggestions after user has focused the search (not on mount). */
  const [suggestionsRevealed, setSuggestionsRevealed] = useState(false);
  /** When false, suggestions dropdown is closed (e.g. after click outside). */
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Run search when landing with initialQuery (e.g. from Navbar); skip when searchBarOnly (parent owns results)
  useEffect(() => {
    const q = (initialQuery ?? "").trim();
    if (!q || initialQueryRun.current || variant === "searchBarOnly") return;
    initialQueryRun.current = true;
    dispatch(setSearchQuery(q));
    const run = async () => {
      onSearchStart?.();
      setHasSearched(true);
      try {
        const response = await fetchSearchWords({
          q,
          mode: "partial",
          lang: "urhobo",
          reverse: true,
        }).unwrap();
        const transformed = transformSearchResponse(response, "urhobo");
        const records = transformed.records || [];
        setFullSearchResults(records);
        onSearchComplete?.(records, q);
      } catch {
        setFullSearchResults([]);
        onSearchComplete?.([], q);
      }
    };
    run();
  }, [
    initialQuery,
    variant,
    dispatch,
    fetchSearchWords,
    onSearchComplete,
    onSearchStart,
  ]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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

  // Fetch word of day
  useEffect(() => {
    const loadWordOfDay = async () => {
      try {
        const res = await fetchWordOfDay().unwrap();
        if (res?.word) {
          setWordOfDayData({
            word: res.word,
            meaning: res.meaning,
            photo: res.photo,
            photoUrl: res.photo?.url,
          });
        }
      } catch (err) {
        console.error("Failed to load word of day:", err);
      }
    };
    loadWordOfDay();
  }, [fetchWordOfDay]);

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

  const saveSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter((h) => h !== term)].slice(
      0,
      10,
    );
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter((h) => h !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search === searchQuery) return;
    setSearch(searchQuery);
  }, [searchQuery]);

  const debouncedValue = useDebounce(search, 700);

  useEffect(() => {
    if (!debouncedValue) return;
    handleSearchChange(debouncedValue);
  }, [debouncedValue]);

  const handleSearchChange = (query: string): void => {
    // if (!suggestionsOpen || !suggestionsRevealed) {
    //   setSuggestionsOpen(true);
    //   setSuggestionsRevealed(true);
    // }
    dispatch(setSearchQuery(query));

    if (!isMobile) {
      requestAnimationFrame(() => {
        if (!inputRef.current) return;
        inputRef.current.setSelectionRange(query.length, query.length);

        const padding = 10;
        inputRef.current.scrollLeft = inputRef.current.scrollWidth + padding;
        // inputRef.current.focus();
      });
    }

    if (query.trim()) {
      setShowHistory(false);
    } else {
      setSuggestions([]);
      if (searchHistory.length > 0) setShowHistory(true);
      setFullSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleSuggestionClick = (word: string) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    dispatch(setSearchQuery(word));
    setShowHistory(false);
    setSuggestionsRevealed(false);
    setSuggestions([]);
    inputRef.current?.blur();
    performSearch(word);
  };

  /**
   * Group suggestions for display: left = primary (in search language), right = others.
   * - Korean query (Hangul): primary = Korean value, others on right.
   * - Urhobo query (Latin, matches word): primary = Urhobo (word), others on right.
   * - English query: current behavior — primary = eyuo ?? word, right = headwords.
   */
  const searchSuggestions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matchedSuggestions = suggestions
      .map((item) => {
        if (item.word.toLowerCase().trim().startsWith(q))
          return { label: item.word, captions: [...(item.eyuoEng ?? "")] };

        if (item.eyuoKor?.toLowerCase().trim().startsWith(q))
          return { label: item.eyuoKor, captions: [item.word ?? ""] };

        const matchedEng = item.eyuoEng?.find((item) =>
          item.toLowerCase().trim().startsWith(q),
        );
        if (matchedEng)
          return { label: matchedEng, captions: [item.word ?? ""] };
      })
      .filter((item) => item);

    if (!matchedSuggestions || matchedSuggestions.length == 0) return [];

    const map = new Map<string, string[]>();
    for (const item of matchedSuggestions) {
      if (!item) continue;

      if (!map.has(item.label)) {
        map.set(item.label, []);
      }
      map.get(item.label)!.push(...item.captions);
    }

    const result = Array.from(map.entries()).map(([label, captions]) => ({
      label,
      captions,
    }));

    return result;
  }, [suggestions, searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim() || !user) {
      if (!user) setShowComingSoonModal(true);
      return;
    }

    onSearchStart?.();
    setHasSearched(true);
    saveSearchToHistory(query);
    setShowHistory(false);

    if (onSearchOnly) {
      onSearchOnly(query.trim());
      return;
    }

    try {
      const response = await fetchSearchWords({
        q: query.trim(),
        mode: "partial",
        lang: "urhobo",
        reverse: true,
      }).unwrap();

      const transformed = transformSearchResponse(response, "urhobo");
      const records = transformed.records || [];
      setFullSearchResults(records);
      // NEO
      // dispatch(setSearchQuery(""));
      onSearchComplete?.(records, query.trim());
    } catch (err) {
      console.error("Search error:", err);
      setFullSearchResults([]);
      onSearchComplete?.([], query.trim());
    }
  };

  const handleHistoryClick = (term: string) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    setShowHistory(false);
    setSuggestionsRevealed(false);
    dispatch(setSearchQuery(term));
    performSearch(term);
  };

  const handleFocus = () => {
    if (isMobile) {
      setShowMobileDrawer(true);
      return;
    }
    setSuggestionsOpen(true);
    if (variant === "searchBarOnly") {
      setSuggestionsRevealed(true);
    }
    if (!searchQuery.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  // Close suggestions and history when clicking outside the search area.
  // Use `click` (not `mousedown`) so inner buttons (like the history X icon)
  // can run their own onClick handlers before this closes the dropdown.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current?.contains(e.target as Node)) return;

      if (historyContainerRef.current?.contains(e.target as Node)) return;

      setSuggestionsOpen(false);
      // setSuggestionsRevealed(false);
      setShowHistory(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMobileInputClick = () => {
    if (isMobile) {
      setShowMobileDrawer(true);
      return;
    }

    if (!suggestionsOpen) {
      setSuggestionsOpen(true);
    }

    if (!suggestionsRevealed) {
      setSuggestionsRevealed(true);
    }

    if (!showHistory && !searchQuery.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  type Suggestion = {
    label: string;
    captions: string[];
  };

  const onSelect = (item: Suggestion | string) => {
    if (dropDownType() == "suggestions") {
      let value;
      if (typeof item !== "string") value = item.label;
      else value = item;

      if (value !== "") {
        handleSuggestionClick(value);
      }
    }

    if (dropDownType() == "history" && typeof item === "string") {
      handleHistoryClick(item);
    }
  };

  const dropDownType = () => {
    if (isMobile) return "none";

    if (showHistory && searchHistory.length > 0) return "history";

    if (
      searchQuery.trim() !== "" &&
      (variant !== "searchBarOnly" || suggestionsRevealed) &&
      suggestionsOpen
    )
      return "suggestions";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handle_Key_Down(e, searchQuery);
  };

  const {
    activeIndex,
    setActiveIndex,
    handleKeyDown: handle_Key_Down,
    itemRefs,
  } = useKeyboardListNavigation({
    items: dropDownType() == "suggestions" ? searchSuggestions : searchHistory,
    loop: true,
    onSelect,
  });

  return (
    <div>
      <motion.div
        className="w-full max-w-full min-w-0 lg:mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative flex flex-col gap-3 sm:gap-4 w-full">
          {/* Pill-shaped search input + suggestions */}
          <div className="relative w-full" ref={searchContainerRef}>
            <div
              className="rounded-full border shadow-sm flex items-center px-4 py-3 min-h-[56px]"
              style={{ backgroundColor: "#F2FEFF", borderColor: "#8AA5A8" }}
            >
              <Search
                className="w-5 h-5 shrink-0 mr-3"
                style={{ color: "#8AA5A8" }}
              />
              <input
                ref={inputRef}
                type="text"
                id="search"
                autoComplete="off"
                placeholder={t("searchGuono")}
                className="flex-1 min-w-0 bg-transparent text-base outline-none placeholder:text-gray-400 focus:outline-none"
                style={{ color: "#8AA5A8" }}
                value={search}
                onFocus={handleFocus}
                onClick={handleMobileInputClick}
                onChange={(e) => {
                  if (!isMobile) setSearch(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                readOnly={isMobile}
              />
              {variant === "full" && !searchQuery && wordOfDayData?.word && (
                <>
                  <div
                    className="relative inline-flex items-center"
                    onMouseEnter={() => setShowWordOfDayImage(true)}
                    onMouseLeave={() => setShowWordOfDayImage(false)}
                  >
                    <span
                      className="text-base cursor-default"
                      style={{ color: "#8AA5A8" }}
                    >
                      {wordOfDayData.word}
                    </span>
                    {showWordOfDayImage && wordOfDayData && !isMobile && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white w-[280px] sm:w-[320px]">
                        {(() => {
                          const imageUrl =
                            wordOfDayData.photo?.url || wordOfDayData.photoUrl;
                          return imageUrl ? (
                            <div className="relative w-full aspect-4/3 bg-gray-100">
                              <Image
                                src={imageUrl}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="320px"
                              />
                            </div>
                          ) : null;
                        })()}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {wordOfDayData.word}
                            </h3>
                            <Share2
                              className="w-4 h-4 shrink-0 text-gray-400"
                              aria-hidden
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium text-gray-500">
                              {"Oto"}:{" "}
                            </span>
                            <span className="line-clamp-2">
                              {wordOfDayData.meaning || "—"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {searchQuery && !isMobile && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setSearchQuery(""));
                    if (searchHistory.length > 0) setShowHistory(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-[#E0EFF1] text-[#8AA5A8] transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div
                className="w-px h-4 mx-2"
                style={{ backgroundColor: "#8AA5A8" }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!isMobile) return setShowKeyboard(!showKeyboard);

                  if (!showMobileDrawer) {
                    setShowMobileDrawer(true);
                    setShowMobileKeyboard(true);
                    return;
                  }
                  setShowMobileKeyboard(!showMobileKeyboard);
                }}
                className="p-1.5 rounded hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
                aria-label="Keyboard"
                style={{ color: "#8AA5A8" }}
              >
                <Keyboard className="w-5 h-5" />
              </button>
            </div>

            <KeyboardURH
              isOpen={showKeyboard}
              value={isMobile ? "" : search}
              handleChange={setSearch}
              handleEnter={(value) => {
                if (value !== "") {
                  performSearch(value);
                }
              }}
              onClose={() => setShowKeyboard(false)}
            />
          </div>

          {/* Autocomplete suggestions dropdown (searchBarOnly: only after user has focused input) */}
          {dropDownType() == "suggestions" && (
            <div
              tabIndex={0}
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40 max-h-[280px] overflow-y-auto"
            >
              {suggestionsLoading ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  {t("loading") || "Loading..."}
                </div>
              ) : searchSuggestions.length > 0 ? (
                <ul className="">
                  {searchSuggestions.map((item, index) => {
                    if (!item) return <></>;

                    return (
                      <li
                        key={index}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => onSelect(item.label)}
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(item.label);
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${index === activeIndex ? "bg-primary text-white" : "text-gray-900"}`}
                        >
                          <Search
                            className="w-4 h-4 shrink-0"
                            style={{
                              color:
                                index === activeIndex ? "white" : "#8AA5A8",
                            }}
                          />
                          <span className="font-medium ">{item.label}</span>
                          <span
                            className="w-px h-3 bg-gray-200 shrink-0"
                            aria-hidden
                          />
                          <span
                            className={`text-sm ${index === activeIndex ? "text-white" : "text-gray-600"}`}
                          >
                            {item.captions.join(", ")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  {t("noSuggestions")}
                </div>
              )}
            </div>
          )}

          {/* Search Result Tag */}
          {variant === "full" &&
            hasSearched &&
            fullSearchResults.length > 0 &&
            (() => {
              const firstResult = fullSearchResults[0];
              const englishTranslation =
                firstResult?.translations?.en?.[0]?.word;
              return (
                <div className="bg-[#9CB8BE] rounded-lg px-4 py-3 flex items-center gap-3 min-h-[48px]">
                  <span className="text-white text-base font-normal">
                    {firstResult?.word || searchQuery}
                  </span>
                  {englishTranslation && (
                    <>
                      <div className="w-px h-4 bg-white/50" />
                      <span className="text-white text-base font-normal">
                        {englishTranslation}
                      </span>
                    </>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setHasSearched(false);
                      setFullSearchResults([]);
                      dispatch(setSearchQuery(""));
                      dispatch(setSearchResults([]));
                    }}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              );
            })()}

          {/* Search History - Desktop (floating so it doesn't push content down) */}
          {dropDownType() == "history" && (
            <div
              tabIndex={0}
              ref={historyContainerRef}
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-40 max-h-52 overflow-y-scroll"
            >
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => onSelect(term)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${index === activeIndex ? "bg-primary text-white" : "text-gray-600"}`}
                >
                  <Clock className="w-5 h-5 shrink-0 text-gray-400" />
                  <span className="shrink-0">{term}</span>
                  <span className="flex-1 min-w-0" aria-hidden />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeFromHistory(term, e);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
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
          <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
        )}
      </motion.div>

      {/* Mobile Search Drawer */}
      <AnimatePresence>
        {showMobileDrawer && (
          <MobileSearchDrawer
            isOpen={showMobileDrawer}
            onClose={() => setShowMobileDrawer(false)}
            onPerformSearch={performSearch}
            showKeyboard={showMobileKeyboard}
            setShowKeyboard={setShowMobileKeyboard}
          />
        )}
      </AnimatePresence>

      {showComingSoonModal && (
        <ComingSoonModal closeModal={() => setShowComingSoonModal(false)} />
      )}
    </div>
  );
};
