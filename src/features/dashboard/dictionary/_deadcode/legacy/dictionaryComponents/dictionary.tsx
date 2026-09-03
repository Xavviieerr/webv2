"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";
import {
  useWordCountTotalQuery,
  useWordOfDayQuery,
  useNewlyCoinedWordsQuery,
} from "@/slice/wordEndpoints";
import { AllWords } from "./allWords";
import { GenericSearchComponent } from "@/features/dashboard/dictionary/components/genericSearchComponent";
import NewlyAddedWords from "./newly-added-words";

const FALLBACK_WORD_COUNT = 0;
const CARD_TEAL = "#02474F";
const PRONUNCIATION_BG = "#6EE8EA";
const VIEW_BTN_BG = "#1B6A71";

export const Dictionary = () => {
  const router = useRouter();
  const [showAllWords, setShowAllWords] = useState(false);

  const handleSearch = (query: string) => {
    const q = query.trim();
    if (q) {
      router.push(
        `/dashboard/dictionary/word-details?term=${encodeURIComponent(q)}&reverse=true`,
      );
    }
  };

  const handleViewAllWords = () => {
    setShowAllWords(true);
  };

  if (showAllWords) {
    return (
      <div className="w-full">
        <AllWords
          onGoBack={() => {
            setShowAllWords(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <WelcomeToDictionary
        onSearch={handleSearch}
        onViewAllWords={handleViewAllWords}
      />
      <WordOfDayCard />
      <NewlyAddedWords />
      <NewlyCoinedWordSection />
    </div>
  );
};

const WordOfDayCard = () => {
  const router = useRouter();
  const { data: wotd, isLoading } = useWordOfDayQuery();
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleViewInDictionary = () => {
    if (wotd?.word) {
      router.push(
        `/dashboard/dictionary/word-details?term=${encodeURIComponent(wotd.word)}`,
      );
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[28px]"
      style={{ backgroundColor: CARD_TEAL }}
    >
      {/* Glass overlay - subtle highlight from top-left / bottom-right */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <Image
          src="/word-glass-1.svg"
          alt=""
          fill
          className="object-cover object-[70%_0%] opacity-25"
        />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        {/* Left: title, date, word, part of speech, phonetic + speaker, Pronunciation button */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Word of the Day
          </h2>
          <p className="text-sm text-[#F5DEB3] mt-0.5">{dateStr}</p>
          <div className="flex items-baseline gap-3 mt-5 flex-wrap">
            <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight">
              {isLoading ? "…" : (wotd?.word ?? "—")}
            </span>
            <span className="text-sm text-white font-normal">Noun</span>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap pl-0.5">
            {(wotd?.phonetic ?? wotd?.ipa) && (
              <span className="text-sm text-white">
                /{wotd?.phonetic ?? wotd?.ipa}/
              </span>
            )}
            <button
              type="button"
              className="p-1 rounded-full text-white hover:bg-white/15 transition-colors"
              aria-label="Listen to pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#02474F] shrink-0 border-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: PRONUNCIATION_BG }}
            >
              Pronunciation
            </button>
          </div>
        </div>

        {/* Top-right: View in Dictionary */}
        <button
          type="button"
          onClick={handleViewInDictionary}
          disabled={!wotd?.word}
          className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: VIEW_BTN_BG }}
        >
          View in Dictionary
        </button>
      </div>
    </div>
  );
};

interface WelcomeToDictionaryProps {
  onSearch: (query: string) => void;
  onViewAllWords?: () => void;
}

const WelcomeToDictionary = ({
  onSearch,
  onViewAllWords,
}: WelcomeToDictionaryProps) => {
  const { data: wordCountResponse, isLoading } = useWordCountTotalQuery();
  const wordCount =
    wordCountResponse?.data != null
      ? wordCountResponse.data
      : FALLBACK_WORD_COUNT;

  return (
    <section className="w-full py-12 sm:py-16 lg:py-10 ">
      <div className="w-full max-w-7xl min-w-0 mx-auto flex flex-col items-center text-center px-0">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6 bg-[#02474F]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.6666 6.84554C28.8462 6.94921 28.9991 7.09335 29.1132 7.26648C29.2273 7.43961 29.2995 7.63697 29.324 7.84287L29.3333 8.0002V25.3335C29.3333 25.5676 
                29.2717 25.7975 29.1546 26.0002C29.0376 26.2029 28.8693 26.3712 28.6666 26.4882C28.4639 26.6052 28.234 26.6668 28 26.6668C27.7659 
                26.6668 27.536 26.6052 27.3333 26.4882C25.8225 25.6158 24.1209 25.1273 22.3775 25.0655C20.634 25.0037 18.902 25.3704 17.3333 26.1335V5.90154C19.1751 
                5.21355 21.1463 4.94141 23.1057 5.10461C25.065 5.26781 26.964 5.86232 28.6666 6.84554ZM14.6666 5.90287L14.668 26.1349C13.161 
                25.4013 11.5024 25.0331 9.82665 25.0602C8.15086 25.0873 6.50505 25.5089 5.02263 26.2909L4.58663 26.5309L4.44929 26.5895L4.38396 
                26.6109L4.23729 26.6455L4.15596 26.6589L3.99996 26.6669H3.94396L3.79729 26.6509L3.69463 26.6322L3.55063 26.5895L3.38263 26.5149L3.25596 
                26.4402L3.13729 26.3509L3.05729 26.2762L2.95996 26.1669L2.87463 26.0482L2.84529 26.0002L2.80263 25.9202L2.74396 25.7829L2.72263 25.7175L2.68796 
                25.5709L2.67463 25.4895L2.66929 25.4242L2.66663 8.0002C2.66663 7.76616 2.72824 7.53624 2.84527 7.33356C2.96229 7.13087 3.13061 6.96256 3.33329 
                6.84554C5.03602 5.86253 6.93507 5.26826 8.89442 5.10529C10.8538 4.94232 12.8249 5.21468 14.6666 5.90287Z"
              fill="#F5DEB3"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl lg:text-[32px] font-semibold text-gray-900 mb-3">
          Welcome to Urhobo Dictionary
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-700 mb-2 max-w-xl">
          Discover meanings, pronunciations, and cultural context of Urhobo
          words.
        </p>

        {/* Word count  and view all words button*/}
        <div className="flex flex-col lg:flex-row items-center max-w-[450px] text-[20px] gap-4">
          <p className=" text-gray-600">
            Word Count: {isLoading ? "…" : wordCount.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={onViewAllWords}
            className="text-[#02474F] underline cursor-pointer hover:text-[#013238] transition-colors"
          >
            View all words
          </button>
        </div>

        {/* Search — GenericSearchComponent (suggestions, history, mobile drawer built-in) */}
        <div className="w-full max-w-2xl min-w-0 mt-5">
          <GenericSearchComponent onSearchOnly={onSearch} />
        </div>
      </div>
    </section>
  );
};

const NewlyCoinedWordSection = () => {
  const router = useRouter();
  console.log("Fetching Newly Coined");
  const { data: newlyCoinedWordsData, isLoading } = useNewlyCoinedWordsQuery();
  console.log("===Newly coined words=== 2", newlyCoinedWordsData);

  const handleViewWord = (word: string) => {
    router.push(
      `/dashboard/dictionary/word-details?term=${encodeURIComponent(word)}`,
    );
  };

  // Transform API response to component format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      approved: "Approved",
      pending: "Open for Review",
      rejected: "Rejected",
    };
    return statusMap[status.toLowerCase()] || "Open for Review";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPronunciation = (word: any) => {
    if (word?.oho && word.oho.length > 0) {
      const firstOho = word.oho[0];
      return firstOho.uphoesio || firstOho.upho || "";
    }
    return "";
  };

  const words = newlyCoinedWordsData || [];

  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Tag */}
        <div className="lg:mb-6 flex justify-start">
          <div
            className="inline-block rounded-xl py-2.5 px-4 text-center"
            style={{ backgroundColor: "#F7E0B3" }}
          >
            <h2 className="text-base sm:text-lg font-medium text-[#02474F]">
              Newly Coined Words
            </h2>
          </div>
        </div>

        {/* Grid of Word Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative rounded-lg p-4 sm:p-5 bg-white flex flex-col min-h-[160px] border border-gray-200/30 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No newly coined words available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {words.map((word) => {
              const pronunciation = getPronunciation(word);
              const statusDisplay = getStatusDisplay(word.status);
              const dateAdded = formatDate(word.createdAt);

              return (
                <div
                  key={word.id}
                  onClick={() => handleViewWord(word.ota)}
                  className="relative cursor-pointer rounded-lg p-4 bg-white sm:p-5 flex flex-col min-h-[160px] border border-gray-200/30 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Top Row: Word + Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0">
                      {word.ota}
                    </h3>
                    <div
                      className="shrink-0 rounded-md px-2.5 py-2 text-xs font-normal whitespace-nowrap"
                      style={{
                        backgroundColor: "#0E808D1A",
                        color: "#05353A",
                      }}
                    >
                      {statusDisplay}
                    </div>
                  </div>

                  {/* Pronunciation */}
                  {pronunciation && (
                    <p className="text-sm text-gray-600 italic mb-auto ">
                      /{pronunciation}/
                    </p>
                  )}

                  {/* Bottom Row: Date + View Link */}
                  <div className="flex items-center justify-between mt-auto pt-3 bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">Added - {dateAdded}</p>
                    <button
                      type="button"
                      onClick={() => handleViewWord(word.ota)}
                      className="text-sm font-medium text-[#007BFF] hover:underline transition-colors"
                    >
                      View Word
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
