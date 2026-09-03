"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ChevronLeft, Volume2, ChevronDown } from "lucide-react";
import { useLazySearchWordsQuery } from "@/slice/wordEndpoints";
import { transformSearchResponse } from "@/utils/transformSearchResponse";
import { WordRecord } from "@/slice/wordSlice";

interface DictionarySearchProps {
  searchQuery: string;
  onGoBack: () => void;
  onSearch: (query: string) => void;
}

export const DictionarySearch = ({
  searchQuery,
  onGoBack,
  onSearch,
}: DictionarySearchProps) => {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [fetchSearchWords, { data, isLoading, isFetching }] =
    useLazySearchWordsQuery();

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchWords({
        q: searchQuery.trim(),
        mode: "partial",
        lang: "urhobo",
      });
    }
  }, [searchQuery, fetchSearchWords]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localQuery.trim();
    if (q) {
      onSearch(q);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
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

  const transformedData = data
    ? transformSearchResponse(data, "urhobo")
    : { records: [] as WordRecord[], metadata: { count: 0 } };
  const results: WordRecord[] = transformedData.records || [];
  const hasResults = results.length > 0;
  const isSearching = isLoading || isFetching;

  return (
    <div className="w-full min-h-screen bg-grayscale py-6 sm:py-8">
      <div className="w-full mx-auto">
        {/* Go Back Button */}
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

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="max-w-7xl mx-auto bg-[#E8EDF2] rounded-xl p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search a word in Urhobo or English"
              className="flex-1 min-w-0 bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              aria-label="Search dictionary"
            />
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Search Results Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Search Results for &apos;{searchQuery}&apos;
        </h2>

        {/* Results or No Results */}
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className=" rounded-lg p-4 sm:p-5 min-h-[200px] border border-gray-200/30 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : hasResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {results.map((record: WordRecord) => {
              const sensesCount = record.meanings?.length || 0;
              const pronunciation =
                record.pronunciation?.phonetic ||
                record.pronunciation?.ipa ||
                "";
              const firstMeaning = record.meanings?.[0];
              const createdAt = firstMeaning
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (data as any)?.data?.results?.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (r: any) => r.word?.ota === record.word
                  )?.word?.createdAt
                : undefined;

              return (
                <div
                  key={record.id}
                  className="bg-[#E6F8F9] rounded-lg p-4 sm:p-5 border border-gray-200/30 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[200px]"
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
                        className="p-1 rounded-full hover:bg-white/50 text-[#008080] transition-colors"
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

                  {/* Show Senses Link */}
                  {sensesCount > 0 && (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-sm font-medium text-[#FF8C00] hover:text-[#FF7A00] mb-auto transition-colors"
                    >
                      <span>Show Senses</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200/50 my-3"></div>

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
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            {/* No Results Illustration */}
            <div className="mb-6 max-w-md w-full">
              <Image
                src="/word-not-found.svg"
                alt="No word found"
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>

            {/* No Results Text */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              No word Found
            </h3>
            <p className="text-base text-gray-600 text-center max-w-md">
              This word isn&apos;t in the dictionary yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
