"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useGetAllWordsQuery } from "@/slice/wordEndpoints";
import { WordRecord } from "@/slice/wordSlice";
import { GenericSearchComponent } from "@/features/dashboard/dictionary/components/genericSearchComponent";

// Urhobo alphabet - includes standard Latin letters plus Urhobo-specific characters
const URHOBO_ALPHABET = [
  "A", "B", "D", "E", "Ẹ", "F", "G", "H", "I", "J", "K", "L", "M", 
  "N", "O", "Ọ", "P", "R", "S", "T", "U", "V", "W", "Y", "Z"
];

const WORDS_PER_PAGE = 6;

interface AllWordsProps {
  onGoBack?: () => void;
}

// Transform word data from /word endpoint to WordRecord format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformWordToRecord = (wordData: any): WordRecord => {
  const oho = wordData.oho || [];
  const efaEng = wordData.efaEng || [];
  const efaKor = wordData.efaKor || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meanings = oho.map((ohoItem: any) => ({
    word: wordData.ota,
    definitions: [ohoItem.oto].filter(Boolean),
    partOfSpeech: ohoItem.ekerota || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examples: (ohoItem.idje || []).map((e: any) => e.sentence),
    synonyms: (ohoItem.okpo || []).filter(Boolean).map((s: string) => ({ word: s })),
    plurals: (ohoItem.ibuebu || []).filter(Boolean),
    antonyms: (ohoItem.orhan || []).filter(Boolean),
    relatedWords: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    media: (ohoItem.oma || []).map((mediaItem: any) => ({
      url: mediaItem.url || "",
      type: mediaItem.type || "photo",
    })),
    dialect: ohoItem.erevwe || wordData.erevwe,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const englishTranslations = efaEng.map((engItem: any) => ({
    word: engItem.otaWord,
    definitions: [engItem.details?.oto].filter(Boolean),
    partOfSpeech: engItem.details?.ekerota || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examples: (engItem.details?.idje || []).map((e: any) => e.sentence),
    synonyms: (engItem.details?.okpo || []).filter(Boolean).map((s: string) => ({ word: s })),
    plurals: (engItem.details?.ibuebu || []).filter(Boolean),
    antonyms: (engItem.details?.orhan || []).filter(Boolean),
    relatedWords: [],
    media: [],
    dialect: null,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const koreanTranslations = efaKor.map((korItem: any) => ({
    word: korItem.otaWord,
    definitions: [korItem.details?.oto].filter(Boolean),
    partOfSpeech: korItem.details?.ekerota || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examples: (korItem.details?.idje || []).map((e: any) => e.sentence),
    synonyms: (korItem.details?.okpo || []).filter(Boolean).map((s: string) => ({ word: s })),
    plurals: (korItem.details?.ibuebu || []).filter(Boolean),
    antonyms: (korItem.details?.orhan || []).filter(Boolean),
    relatedWords: [],
    media: [],
    dialect: null,
  }));

  const firstOho = oho[0];
  const pronunciation = firstOho
    ? { ipa: firstOho.upho || "", phonetic: firstOho.uphoesio || "" }
    : undefined;

  return {
    id: wordData.id,
    word: wordData.ota,
    language: "urhobo",
    matchType: "exact",
    similarityScore: 100,
    meanings,
    translations: { en: englishTranslations, kor: koreanTranslations },
    pairedExamples: [],
    isFavorite: false,
    pronunciation,
    otaOkpopko: wordData.otaOkpopko || false,
    creationReason: wordData.creationReason || null,
  };
};

export const AllWords = ({ onGoBack }: AllWordsProps) => {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch only approved words
  const { data, isLoading, isFetching } = useGetAllWordsQuery(
    {
      page: 1,
      limit: 100,
      status: "approved",
      ...(searchQuery.trim() && { search: searchQuery.trim() }),
    },
    { skip: false }
  );

  const handleLetterClick = (letter: string) => {
    // Toggle: if clicking the same letter, deselect it (show all words)
    if (selectedLetter === letter) {
      setSelectedLetter("");
    } else {
      setSelectedLetter(letter);
    }
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchFilter = (query: string) => {
    const q = query.trim();
    setSearchQuery(q);
    setSelectedLetter("");
    setCurrentPage(1);
  };

  const handleViewWord = (word: string) => {
    router.push(`/dashboard/dictionary/word-details?term=${encodeURIComponent(word)}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jan 28 21:28";
    try {
      const date = new Date(dateString);
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${month} ${day} ${hours}:${minutes}`;
    } catch {
      return "Jan 28 21:28";
    }
  };

  // Transform API response to WordRecord format
  // Response structure: { data: { data: [...], pagination: {...} }, message: "..." }
  const wordsArray = Array.isArray(data?.data?.data) ? data.data.data : [];
  // Filter to only show approved words (client-side safety filter)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const approvedWordsArray = wordsArray.filter((word: any) => 
    word.status?.toLowerCase() === "approved"
  );
  const allWords: WordRecord[] = approvedWordsArray
    .map(transformWordToRecord)
    .sort((a: WordRecord, b: WordRecord) => {
      // Sort alphabetically by word (case-insensitive)
      return a.word.localeCompare(b.word, 'en', { sensitivity: 'base' });
    });

  // Filter words by selected letter if a letter is selected (client-side filtering)
  const filteredResults = selectedLetter
    ? allWords.filter((record) => {
        const firstChar = record.word.charAt(0).toUpperCase();
        return firstChar === selectedLetter;
      })
    : allWords;

  const displayLetter = selectedLetter;
  const isSearching = isLoading || isFetching;

  // Pagination: show 9 words per page
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / WORDS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedWords = filteredResults.slice(
    (safePage - 1) * WORDS_PER_PAGE,
    safePage * WORDS_PER_PAGE
  );

  // Keep currentPage in sync when results shrink (e.g. after filter)
  useEffect(() => {
    if (!isSearching && currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [isSearching, currentPage, totalPages]);

  return (
    <div className="w-full min-h-screen py-6 sm:py-8 overflow-x-hidden">
      <div className="w-full min-w-0 mx-auto">
        {/* Go Back Button */}
        {onGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-200 bg-white hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Go Back</span>
          </button>
        )}

        {/* Urhobo Alphabet Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {URHOBO_ALPHABET.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => handleLetterClick(letter)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? "bg-[#02474F] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar — GenericSearchComponent (suggestions, history built-in) */}
        <div className="mb-8 max-w-2xl mx-auto w-full min-w-0 px-0">
          <GenericSearchComponent onSearchOnly={handleSearchFilter} />
        </div>

        {/* Section Heading - Large Letter */}
        {displayLetter && (
          <div className="mb-6">
            <h2 className="text-6xl sm:text-7xl font-light text-gray-300">
              {displayLetter}
            </h2>
          </div>
        )}

        {/* Word Cards Grid */}
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 sm:p-5 min-h-[200px] border border-gray-200 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedWords.map((record: WordRecord) => {
              const sensesCount = record.meanings?.length || 0;
              const pronunciation =
                record.pronunciation?.phonetic ||
                record.pronunciation?.ipa ||
                "";
              // Find the original word data to get createdAt
              const originalWordData = approvedWordsArray.find(
                (w: { ota: string; createdAt?: string }) => w.ota === record.word
              );
              const createdAt = originalWordData?.createdAt;

              return (
                <div
                  key={record.id}
                  onClick={() => handleViewWord(record.word)}
                  className="bg-white rounded-lg cursor-pointer p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[200px]"
                >
                  {/* Top Row: Word + Senses Count */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0">
                      {record.word}
                    </h3>
                    <span className="text-sm text-gray-600 shrink-0">
                      Senses - {sensesCount}
                    </span>
                  </div>

                  {/* Pronunciation Tag + Audio Icon */}
                  {pronunciation && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-[#B3E0E6] text-xs font-medium text-[#008080]">
                        <span>Pronunciation</span>
                      </div>
                      <button
                        type="button"
                        className="p-1 rounded-full hover:bg-gray-100 text-[#008080] transition-colors"
                        aria-label="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Phonetic Transcription */}
                  {pronunciation && (
                    <p className="text-sm text-gray-700 mb-4 font-mono">
                      {pronunciation}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200/50 my-3 mt-auto"></div>

                  {/* Footer: Date + View Word */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Added - {formatDate(createdAt)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleViewWord(record.word)}
                      className="text-sm font-medium text-[#007BFF] hover:underline transition-colors"
                    >
                      View Word
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No words found.</p>
          </div>
        )}
      </div>
    </div>
  );
};