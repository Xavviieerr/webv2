"use client";

import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { useLazyAutocompleteQuery } from "@/slice/endpoints";
import { setSearchQuery, setSearchResults } from "@/slice/wordSlice";
import { groupSearchSuggestions } from "@/utils/searchSuggestions";
import { Search, ArrowLeft, Clock, X, Keyboard } from "lucide-react";
import ComingSoonModal from "./ComingSoonModal";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { KeyboardURH } from "@/features/shared";

interface SearchResult {
  id: number;
  word: string;
  eyuo?: string;
  eyuoKor?: string;
}

/** True if string contains Hangul (Korean). */
function hasHangul(s: string): boolean {
  return /[\uAC00-\uD7AF]/.test(s);
}

interface MobileSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPerformSearch?: (query: string) => void;
  /** When "dictionary", routes to dashboard dictionary word-details with reverse=true and skips auth modal */
  variant?: "default" | "dictionary";
  showKeyboard: boolean;
  setShowKeyboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const mobileDropdownMotion: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.18,
      ease: "easeInOut",
    },
  },
};

const MobileSearchDrawer: React.FC<MobileSearchDrawerProps> = ({
  isOpen,
  onClose,
  onPerformSearch,
  variant = "default",
  showKeyboard,
  setShowKeyboard,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const user = useAppSelector((state) => state.auth.user);
  const { searchQuery, searchResults, isLoading } = useAppSelector(
    (state) => state.word,
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const isDictionary = variant === "dictionary";

  // Load search history (use separate key for dictionary to avoid mixing with main search)
  const historyKey = isDictionary ? "dictionarySearchHistory" : "searchHistory";
  useEffect(() => {
    const stored = localStorage.getItem(historyKey);
    if (stored) setSearchHistory(JSON.parse(stored));
  }, [historyKey]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else if (!isOpen) {
      dispatch(setSearchQuery(""));
      dispatch(setSearchResults([]));
      setShowHistory(false);
    }
  }, [isOpen, dispatch]);

  // Save search query
  const saveSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(
      0,
      10,
    );
    setSearchHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  };

  const handleSearchChange = (query: string): void => {
    dispatch(setSearchQuery(query));
    if (query.trim()) setShowHistory(false);

    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      inputRef.current.setSelectionRange(query.length, query.length);

      const padding = 10;
      inputRef.current.scrollLeft = inputRef.current.scrollWidth + padding;
      inputRef.current.focus();
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      onKeyDown();
    }
  };

  const onKeyDown = () => {
    if (!isDictionary && !user) {
      setShowComingSoonModal(true);
      return;
    }
    saveSearchToHistory(searchQuery);
    if (onPerformSearch) {
      onPerformSearch(searchQuery.trim());
      onClose();
    } else if (isDictionary) {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(
        `/dashboard/dictionary/word-details?term=${encodeURIComponent(searchQuery.trim())}&reverse=true`,
      );
      onClose();
    } else {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(
        `/newWordDetails?term=${encodeURIComponent(searchQuery.trim())}`,
      );
      onClose();
    }
  };

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        dispatch(setSearchResults([]));
        if (searchHistory.length > 0) {
          setShowHistory(true);
        }
        return;
      }
      try {
        const result = await fetchAutocomplete({ q: searchQuery }).unwrap();
        if (result && typeof result === "object" && "requiresAuth" in result) {
          setShowComingSoonModal(true);
          dispatch(setSearchResults([]));
          return;
        }
        if (Array.isArray(result)) {
          dispatch(
            setSearchResults(
              result.map((item, index) => ({
                ...item,
                id: typeof item.id === "number" ? item.id : index,
              })) as SearchResult[],
            ),
          );
          setShowHistory(false);
        }
      } catch {
        dispatch(setSearchResults([]));
      }
    };

    const timeout = setTimeout(() => {
      if (searchQuery !== undefined) fetchSuggestions();
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch, fetchAutocomplete, searchHistory.length]);

  /**
   * Group suggestions for display: left = primary (in search language), right = others.
   * - Korean query (Hangul): primary = Korean value (eyuoKor or Hangul in eyuo/word), others on right.
   * - Urhobo query (Latin, matches word): primary = Urhobo (word), others on right.
   * - English query: primary = eyuo ?? word, right = headwords.
   */
  const searchSuggestions = React.useMemo(
    () => groupSearchSuggestions(searchResults, searchQuery),
    [searchResults, searchQuery],
  );

  const handleWordClick = (wordData: SearchResult) => {
    if (!isDictionary && !user) {
      setShowComingSoonModal(true);
      return;
    }
    saveSearchToHistory(wordData.word);
    dispatch(setSearchQuery(wordData.word));
    if (onPerformSearch) {
      onPerformSearch(wordData.word);
      onClose();
    } else if (isDictionary) {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(
        `/dashboard/dictionary/word-details?term=${encodeURIComponent(wordData.word)}&reverse=true`,
      );
      onClose();
    } else {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(`/newWordDetails?term=${encodeURIComponent(wordData.word)}`);
      onClose();
    }
  };

  const handleHistoryClick = (term: string) => {
    if (!isDictionary && !user) {
      setShowComingSoonModal(true);
      return;
    }
    saveSearchToHistory(term);
    dispatch(setSearchQuery(term));
    if (onPerformSearch) {
      onPerformSearch(term);
      onClose();
    } else if (isDictionary) {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(
        `/dashboard/dictionary/word-details?term=${encodeURIComponent(term)}&reverse=true`,
      );
      onClose();
    } else {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(`/newWordDetails?term=${encodeURIComponent(term)}`);
      onClose();
    }
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter((t) => t !== term);
    setSearchHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  };

  const handleFocus = () => {
    if (!searchQuery.trim() && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  // Prevent body scroll when drawer is open.
  // iOS Safari can "jump" the page when toggling overflow; use fixed-body lock instead.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const html = document.documentElement;

    const getOverscrollBehavior = (el: HTMLElement) =>
      el.style.getPropertyValue("overscroll-behavior");
    const setOverscrollBehavior = (el: HTMLElement, value: string) =>
      el.style.setProperty("overscroll-behavior", value);

    const prevBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overscrollBehavior: getOverscrollBehavior(body),
    };
    const prevHtml = {
      overflow: html.style.overflow,
      overscrollBehavior: getOverscrollBehavior(html),
    };

    if (!isOpen) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    setOverscrollBehavior(body, "none");
    html.style.overflow = "hidden";
    setOverscrollBehavior(html, "none");

    return () => {
      const y = Math.abs(parseInt(body.style.top || "0", 10)) || scrollY;
      body.style.overflow = prevBody.overflow;
      body.style.position = prevBody.position;
      body.style.top = prevBody.top;
      body.style.width = prevBody.width;
      setOverscrollBehavior(body, prevBody.overscrollBehavior);
      html.style.overflow = prevHtml.overflow;
      setOverscrollBehavior(html, prevHtml.overscrollBehavior);
      window.scrollTo(0, y);
    };
  }, [isOpen]);

  // Retract keyboard and remove cursor when user scrolls (Google-style behavior)
  useEffect(() => {
    if (!isOpen) return;

    const openedAt = Date.now();
    let touchStartY = 0;
    let scrollTimeout: NodeJS.Timeout;

    const blurInput = () => {
      // Always blur the input to remove cursor and retract keyboard
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };

    const handleScroll = () => {
      // iOS can emit a scroll during the open animation / focus.
      // Ignore very early events so the drawer doesn't "skip" on open.
      if (Date.now() - openedAt < 300) return;
      // Clear any existing timeout
      clearTimeout(scrollTimeout);

      // Blur input immediately when scroll is detected
      blurInput();

      // Also blur after a small delay to catch any delayed scroll events
      scrollTimeout = setTimeout(() => {
        blurInput();
      }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = Math.abs(touchY - touchStartY);

      // Ignore small, accidental moves right after opening (common on iOS)
      if (Date.now() - openedAt < 300) return;

      if (deltaY > 5) {
        blurInput();
      }
    };

    // Listen to scroll on the scroll container
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      scrollContainer.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      scrollContainer.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }

    // We only listen on the drawer's scroll container; window scroll events
    // can fire during iOS viewport/keyboard adjustments and cause "skipping".

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
        scrollContainer.removeEventListener("touchstart", handleTouchStart);
        scrollContainer.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  // Render drawer content in portal at body level to ensure it's above everything
  const drawerContent = (
    <>
      {/* Full Screen Overlay - Google Style */}
      <motion.div
        className="fixed inset-0 bg-[#f2feff] z-9999 flex flex-col"
        style={{ height: "100dvh" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Search Header - Fixed at top */}
        <motion.div
          className="shrink-0 bg-white shadow-sm relative z-101"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 px-3 py-3">
            {/* Search Input Container */}
            <div className="flex-1 relative">
              <div
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-200 ${
                  searchQuery.length
                    ? " text-[#05353A] border-[#8AA5A8]  shadow-[0px_0px_0px_1px_#05353a70]"
                    : " shadow-[0px_0px_0px_1px_#05353a70] text-[#05353a70]"
                }`}
              >
                <button
                  onClick={onClose}
                  className="p-2 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-[#05353A]" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  placeholder={t("searchGuono")}
                  className={`w-full bg-transparent text-base outline-none placeholder:text-gray-400 focus:outline-none ${
                    searchQuery.length ? "text-[#05353A]" : "text-[#05353A]"
                  }`}
                  value={searchQuery}
                  onFocus={handleFocus}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <div className="w-px h-3 bg-[#8AA5A8] mx-2" />
                {searchQuery ? (
                  <button
                    onClick={() => {
                      dispatch(setSearchQuery(""));
                      dispatch(setSearchResults([]));
                      setShowHistory(true);
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <div className="bg-[#05353A] rounded-full cursor-pointer p-1">
                      <X
                        className={`w-4 h-4 ${searchQuery.length ? "text-white" : "text-gray-400"}`}
                      />
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="p-1.5 rounded hover:opacity-80 transition-opacity shrink-0"
                    aria-label="Keyboard"
                    style={{ color: "#8AA5A8" }}
                  >
                    <Keyboard className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Container - Scrollable */}
        <motion.div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileDropdownMotion}
        >
          {/* Search History */}
          {showHistory && searchHistory.length > 0 && !searchQuery.trim() && (
            <div className="pt-2">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-gray-500">
                  {t("recentSearches") || "Recent searches"}
                </span>
              </div>
              {searchHistory.slice(0, 10).map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleHistoryClick(term)}
                >
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-[#05353A] text-base">{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeFromHistory(term, e)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <div className="bg-[#05353A] rounded-full hover:bg-white/20  p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Autocomplete Results */}
          {searchQuery.trim() !== "" && (
            <div className="pt-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[#05353A] border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-3 text-sm text-gray-400">{t("loading")}</p>
                </div>
              ) : searchSuggestions.length > 0 ? (
                <div
                  className="max-h-screen overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  onClick={() => {
                    // Blur input when clicking on scrollable area to retract keyboard
                    if (
                      inputRef.current &&
                      document.activeElement === inputRef.current
                    ) {
                      inputRef.current.blur();
                    }
                  }}
                >
                  {searchSuggestions.map((group, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() =>
                        handleWordClick({
                          id: index,
                          word: group.label,
                          eyuo: group.label,
                        })
                      }
                    >
                      <Search className="w-5 h-5 text-gray-400 shrink-0" />
                      <div className="flex-1 items-center flex min-w-0">
                        <div className="font-medium text-[#05353A]">
                          {group.label}
                        </div>
                        <div className="w-[0.5px] h-3 bg-black/50 mx-2" />
                        <div className="text-sm text-[#05353A]">
                          {group.captions.join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Search className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-400">{t("noResultsFound")}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {t("tryDifferentSearch") || "Try a different search term"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty state when no history and no query */}
          {!showHistory &&
            !searchQuery.trim() &&
            searchHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-base">
                  {t("startSearching") || "Search for words"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {t("searchDescription") || "Find words in Urhobo and English"}
                </p>
              </div>
            )}
        </motion.div>

        <KeyboardURH
          isOpen={showKeyboard}
          value={searchQuery}
          handleChange={handleSearchChange}
          handleEnter={(value) => {
            if (value != "") onKeyDown();
          }}
          onClose={() => setShowKeyboard(false)}
        />
      </motion.div>

      {showComingSoonModal && (
        <ComingSoonModal closeModal={() => setShowComingSoonModal(false)} />
      )}
    </>
  );

  // Render in portal to body to avoid stacking context issues
  if (typeof window === "undefined") return null;
  return createPortal(drawerContent, document.body);
};

export default MobileSearchDrawer;
