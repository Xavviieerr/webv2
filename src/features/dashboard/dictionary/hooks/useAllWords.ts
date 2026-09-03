"use client";

import { useEffect, useState } from "react";

import { useGetAllWordsQuery } from "@/slice/wordEndpoints";
import { WordRecord } from "@/types/word";

import { ALL_WORDS_LIMIT, ALL_WORDS_STATUS, WORDS_PER_PAGE } from "../constants/allWords";
import { URHOBO_ALPHABET } from "../constants/urhoboAlphabet";
import { transformWordToRecord } from "../utils/transformWordToRecord";

/**
 * Data + filter state for the "All Words" browser. Owns the /word fetch,
 * A–Z filter, search input, and pagination so the view component stays
 * presentational.
 */
export function useAllWords() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllWordsQuery(
    {
      page: 1,
      limit: ALL_WORDS_LIMIT,
      status: ALL_WORDS_STATUS,
      ...(searchQuery.trim() && { search: searchQuery.trim() }),
    },
    { skip: false },
  );

  const handleLetterClick = (letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? "" : letter));
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchFilter = (query: string) => {
    setSearchQuery(query.trim());
    setSelectedLetter("");
    setCurrentPage(1);
  };

  const wordsArray = Array.isArray(data?.data?.data) ? data.data.data : [];
  const approvedWordsArray = wordsArray.filter(
    (word: any) => word.status?.toLowerCase() === "approved",
  );

  const allWords: WordRecord[] = approvedWordsArray
    .map(transformWordToRecord)
    .sort((a: WordRecord, b: WordRecord) =>
      a.word.localeCompare(b.word, "en", { sensitivity: "base" }),
    );

  const createdAtByWord: Record<string, string> = {};
  for (const word of approvedWordsArray) {
    if (word.ota && word.createdAt && !(word.ota in createdAtByWord)) {
      createdAtByWord[word.ota] = word.createdAt;
    }
  }

  const filteredResults = selectedLetter
    ? allWords.filter(
        (record) => record.word.charAt(0).toUpperCase() === selectedLetter,
      )
    : allWords;

  const isSearching = isLoading || isFetching;
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / WORDS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedWords = filteredResults.slice(
    (safePage - 1) * WORDS_PER_PAGE,
    safePage * WORDS_PER_PAGE,
  );

  useEffect(() => {
    if (!isSearching && currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [isSearching, currentPage, totalPages]);

  return {
    alphabet: URHOBO_ALPHABET,
    isLoading: isSearching,
    selectedLetter,
    handleLetterClick,
    handleSearchFilter,
    totalPages,
    safePage,
    paginatedWords,
    createdAtByWord,
    hasResults: filteredResults.length > 0,
    setCurrentPage,
  };
}
