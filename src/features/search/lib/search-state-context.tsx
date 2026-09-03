"use client";

import { Lang } from "@/features/shared/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SearchStateResults = {
  words: SensePacket[];
  names: import("@/features/shared/types").NameRecord["items"];
  figures: import("@/features/shared/types").MiniFigures[];
  places: import("@/features/dashboard/places/types").PlaceListItem[];
};

type SearchStateCtx = {
  results: SearchStateResults;
  setResults: React.Dispatch<React.SetStateAction<SearchStateResults>>;
  clearResults: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  wordLanguage: Lang;
  setWordLanguage: React.Dispatch<React.SetStateAction<Lang>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  enterPressed: boolean;
  setEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const EMPTY_RESULTS: SearchStateResults = {
  words: [],
  names: [],
  figures: [],
  places: [],
};

const defaultValue: SearchStateCtx = {
  results: EMPTY_RESULTS,
  setResults: () => {},
  clearResults: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  showSuggestions: true,
  setShowSuggestions: () => {},
  wordLanguage: "urhobo" as Lang,
  setWordLanguage: () => {},
  isLoading: false,
  setIsLoading: () => {},
  enterPressed: false,
  setEnterPressed: () => {},
  error: null,
  setError: () => {},
};

const SearchStateContext = createContext<SearchStateCtx>(defaultValue);

export const SearchStateProvider = ({
  children,
  initialSearchTerm = "",
}: {
  children: React.ReactNode;
  initialSearchTerm?: string;
}) => {
  const [results, setResults] = useState<SearchStateResults>(EMPTY_RESULTS);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wordLanguage, setWordLanguage] = useState<Lang>("urhobo");
  const [isLoading, setIsLoading] = useState(false);
  const [enterPressed, setEnterPressed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearResults = useCallback(() => {
    setResults(EMPTY_RESULTS);
  }, []);

  const value = useMemo(
    () => ({
      results,
      setResults,
      clearResults,
      searchTerm,
      setSearchTerm,
      showSuggestions,
      setShowSuggestions,
      wordLanguage,
      setWordLanguage,
      isLoading,
      setIsLoading,
      enterPressed,
      setEnterPressed,
      error,
      setError,
    }),
    [
      results,
      clearResults,
      searchTerm,
      showSuggestions,
      wordLanguage,
      isLoading,
      enterPressed,
      error,
    ],
  );

  return (
    <SearchStateContext.Provider value={value}>
      {children}
    </SearchStateContext.Provider>
  );
};

export const useSearchState = () => useContext(SearchStateContext);
