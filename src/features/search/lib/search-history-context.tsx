"use client";

import React, { createContext, useContext } from "react";
import { useSearchHistory } from "../hooks/use-search-history";

type SearchHistoryCtx = {
  history: string[];
  saveToHistory: (word: string) => void;
  removeFromHistory: (word: string) => void;
  clearHistory: () => void;
};

const defaultValue: SearchHistoryCtx = {
  history: [],
  saveToHistory: () => {},
  removeFromHistory: () => {},
  clearHistory: () => {},
};

const SearchHistoryContext = createContext<SearchHistoryCtx>(defaultValue);

export const SearchHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { history, saveToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

  return (
    <SearchHistoryContext.Provider
      value={{ history, saveToHistory, removeFromHistory, clearHistory }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistoryCtx = () => useContext(SearchHistoryContext);
