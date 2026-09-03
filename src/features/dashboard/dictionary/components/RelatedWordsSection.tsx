"use client";

import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WordRecord } from "@/types/word";
import { formatDate } from "../utils/formatDate";

interface RelatedWordsSectionProps {
  relatedWords: WordRecord[];
  /** Full record list (with server-added createdAt) used to resolve each card's date. */
  records: (WordRecord & { createdAt?: string })[] | undefined;
  playingAudioUrl: string | null;
  onPlayPronunciation: (url: string | null | undefined) => void;
  onViewWord: (word: string, reverse?: boolean) => void;
  reverse?: boolean;
}

/**
 * "Related Words" grid section shown below the word-details columns.
 * Owns its own heading and card rendering; audio playback and navigation
 * are delegated up through props.
 */
export const RelatedWordsSection = ({
  relatedWords,
  records,
  playingAudioUrl,
  onPlayPronunciation,
  onViewWord,
  reverse,
}: RelatedWordsSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="mb-8">
      <h2 className="text-[22px] font-medium text-[#0E808D] mb-6">
        {t("relatedWordsLabel")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {relatedWords.map((relatedWord: WordRecord) => {
          const createdAt = records?.find(
            (r) => r.word === relatedWord.word,
          )?.createdAt;

          return (
               <div
              key={relatedWord.id}
              className="bg-[#D4E8EA] rounded-xl p-4 sm:p-5 border border-[#9EC9CC] shadow-sm hover:shadow-md transition-all flex flex-col min-h-[200px]"
            >
              {/* Top Row: Word + Senses Count */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-[22px] font-medium text-[#0E808D] flex-1 min-w-0">
                  {relatedWord.word}
                </h3>
              </div>

              {/* Pronunciation pills + Audio Icon */}
              {(relatedWord.pronunciation?.phonetic ||
                relatedWord.pronunciation?.ipa) && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {relatedWord.pronunciation?.phonetic && (
                      <span className="rounded-full px-3 py-1.5 bg-[#E6F7F8] text-[#02474F] text-sm font-sans">
                      {relatedWord.pronunciation.phonetic}
                    </span>
                  )}
                  {relatedWord.pronunciation?.ipa && (
                      <span className="rounded-full px-3 py-1.5 bg-[#0D4D4D] text-white text-sm font-sans">
                      {relatedWord.pronunciation.ipa}
                    </span>
                  )}
                  {relatedWord?.pronunciationAudioUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        onPlayPronunciation(
                          relatedWord?.pronunciationAudioUrl,
                        )
                      }
                      disabled={playingAudioUrl != null}
                      className="p-1 rounded-full hover:bg-[#0E808D]/10 text-[#4A4A4A]/80 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      aria-label="Listen to pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-[#9EC9CC]/50 my-3"></div>

              {/* Footer: Date + View Word */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {t("addedPrefix")}
                  {formatDate(createdAt)}
                </p>
                <button
                  type="button"
                  onClick={() => onViewWord(relatedWord.word, reverse)}
                  className="px-4 py-2 rounded-lg bg-[#0D4D4D] hover:bg-[#1A4349]/90 cursor-pointer text-white text-sm font-medium transition-colors"
                >
                  {t("viewWord")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}