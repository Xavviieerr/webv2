"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useWordOfDayQuery } from "@/slice/wordEndpoints";
import { useWordSearch } from "../../hooks/useWordSearch";
import {
  CARD_TEAL,
  PRONUNCIATION_BG,
  VIEW_BTN_BG,
} from "../../constants/dictionary";

export const WordOfDayCard = () => {
  const { openWordDetails } = useWordSearch();
  const { data: wotd, isLoading } = useWordOfDayQuery();
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleViewInDictionary = () => {
    if (wotd?.word) {
      openWordDetails(wotd.word);
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
