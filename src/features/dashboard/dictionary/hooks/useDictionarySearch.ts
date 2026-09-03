"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { setSearchQuery } from "@/slice/wordSlice";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useKeyboardListNavigation } from "@/hooks/useKeyboardListNavigator";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchHistory } from "./useSearchHistory";
import { useAutocompleteSuggestions } from "./useAutocompleteSuggestions";
import { useComingSoonGate } from "./useComingSoonGate";
import { SEARCH_DEBOUNCE_MS } from "../constants/search";

type Suggestion = {
  label: string;
  captions: string[];
};

export type DropdownType = "suggestions" | "history" | "none" | undefined;

interface UseDictionarySearchParams {
  /** When set, search is delegated to parent (no internal fetch); used when embedded in results page. */
  onSearchOnly?: (query: string) => void;
}

/**
 * Dictionary search controller. Owns the query state, debounce behavior,
 * search execution (with the authentication gate), history interaction,
 * autocomplete, Redux synchronization, and the dropdown/keyboard/mobile-drawer
 * orchestration. The presentation layer consumes the returned values.
 */
export function useDictionarySearch({
  onSearchOnly,
}: UseDictionarySearchParams = {}) {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { searchQuery, error } = useAppSelector((state) => state.word);

  const [showHistory, setShowHistory] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showMobileKeyboard, setShowMobileKeyboard] = useState(false);
  const [suggestionsRevealed, setSuggestionsRevealed] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);

  const {
    searchHistory,
    saveSearchToHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();
  const { showComingSoonModal, ensureUser, openComingSoon, closeComingSoon } =
    useComingSoonGate();
  const { suggestionsLoading, searchSuggestions, clearSuggestions } =
    useAutocompleteSuggestions({
      searchQuery,
      onRequiresAuth: openComingSoon,
    });

  // Keep local input value in sync with the Redux query (e.g. history clicks).
  useEffect(() => {
    if (search === searchQuery) return;
    setSearch(searchQuery);
  }, [searchQuery]);

  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedValue) return;
    handleSearchChange(debouncedValue);
  }, [debouncedValue]);

  const handleSearchChange = (query: string): void => {
    dispatch(setSearchQuery(query));

    if (!isMobile) {
      requestAnimationFrame(() => {
        if (!inputRef.current) return;
        inputRef.current.setSelectionRange(query.length, query.length);

        const padding = 10;
        inputRef.current.scrollLeft = inputRef.current.scrollWidth + padding;
      });
    }

    if (query.trim()) {
      setShowHistory(false);
    } else {
      clearSuggestions();
      if (searchHistory.length > 0) setShowHistory(true);
    }
  };

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      if (!ensureUser()) return;

      saveSearchToHistory(query);
      setShowHistory(false);

      if (onSearchOnly) {
        onSearchOnly(query.trim());
        return;
      }
    },
    [ensureUser, onSearchOnly, saveSearchToHistory],
  );

  const handleSuggestionClick = useCallback(
    (word: string) => {
      if (!ensureUser()) return;
      dispatch(setSearchQuery(word));
      setShowHistory(false);
      setSuggestionsRevealed(false);
      clearSuggestions();
      inputRef.current?.blur();
      performSearch(word);
    },
    [clearSuggestions, dispatch, ensureUser, performSearch],
  );

  const handleHistoryClick = useCallback(
    (term: string) => {
      if (!ensureUser()) return;
      setShowHistory(false);
      setSuggestionsRevealed(false);
      dispatch(setSearchQuery(term));
      performSearch(term);
    },
    [dispatch, ensureUser, performSearch],
  );

  const handleFocus = () => {
    if (isMobile) {
      setShowMobileDrawer(true);
      return;
    }
    setSuggestionsOpen(true);
    setSuggestionsRevealed(true);
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

  const onSelect = useCallback(
    (item: Suggestion | string) => {
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
    },
    [handleHistoryClick, handleSuggestionClick],
  );

  const dropDownType = (): DropdownType => {
    if (isMobile) return "none";

    if (showHistory && searchHistory.length > 0) return "history";

    if (searchQuery.trim() !== "" && suggestionsRevealed && suggestionsOpen)
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

  const handleClearSearch = () => {
    dispatch(setSearchQuery(""));
    if (searchHistory.length > 0) setShowHistory(true);
  };

  const handleKeyboardToggle = () => {
    if (!isMobile) return setShowKeyboard(!showKeyboard);

    if (!showMobileDrawer) {
      setShowMobileDrawer(true);
      setShowMobileKeyboard(true);
      return;
    }
    setShowMobileKeyboard(!showMobileKeyboard);
  };

  return {
    // state
    searchQuery,
    search,
    setSearch,
    error,
    isMobile,
    searchHistory,
    removeFromHistory,
    clearHistory,
    suggestionsLoading,
    searchSuggestions,
    showHistory,
    suggestionsRevealed,
    suggestionsOpen,
    showKeyboard,
    showMobileKeyboard,
    showMobileDrawer,
    setShowMobileDrawer,
    setShowKeyboard,
    setShowMobileKeyboard,
    showComingSoonModal,
    closeComingSoon,
    // keyboard list navigation
    activeIndex,
    setActiveIndex,
    itemRefs,
    dropDownType,
    onSelect,
    // refs
    inputRef,
    searchContainerRef,
    historyContainerRef,
    // handlers
    handleFocus,
    handleMobileInputClick,
    handleKeyDown,
    handleClearSearch,
    handleKeyboardToggle,
    performSearch,
  };
}
