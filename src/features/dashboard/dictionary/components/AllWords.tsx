"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { GenericSearchComponent } from "./genericSearchComponent";
import { formatDate } from "../utils/formatDate";
import { buildWordDetailsHref } from "../utils/buildWordDetailsHref";
import { useAllWords } from "../hooks/useAllWords";

interface AllWordsProps {
  onGoBack?: () => void;
}

export const AllWords = ({ onGoBack }: AllWordsProps) => {
  const router = useRouter();
  const {
    alphabet,
    isLoading,
    selectedLetter,
    handleLetterClick,
    handleSearchFilter,
    totalPages,
    safePage,
    paginatedWords,
    createdAtByWord,
    hasResults,
    setCurrentPage,
  } = useAllWords();

  const handleViewWord = (word: string) => {
    router.push(buildWordDetailsHref(word));
  };

  const displayLetter = selectedLetter;

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
            {alphabet.map((letter) => (
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
        {isLoading ? (
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
        ) : hasResults ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedWords.map((record) => {
              const sensesCount = record.meanings?.length || 0;
              const pronunciation =
                record.pronunciation?.phonetic ||
                record.pronunciation?.ipa ||
                "";
              const createdAt = createdAtByWord[record.word];

              return (
                <div
                  key={record.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => handleViewWord(record.word)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewWord(record.word);
                    }
                  }}
                  className="bg-white group rounded-lg cursor-pointer p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[200px]"
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
                      <span
                        className="p-1 rounded-full text-[#008080]"
                        aria-hidden
                      >
                        <Volume2 className="w-4 h-4" />
                      </span>
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
                      Added - {formatDate(createdAt, "datetime")}
                    </p>
                    <span className="text-sm font-medium text-[#007BFF] group-hover:underline">
                      View Word
                    </span>
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
