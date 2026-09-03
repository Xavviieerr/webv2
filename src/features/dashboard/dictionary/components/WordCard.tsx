"use client";

import { formatDate } from "../utils/formatDate";
import { getStatusDisplay, getPronunciation } from "../utils/helpers";

interface WordCardWord {
  id: string;
  ota: string;
  status: string;
  createdAt: string;
  oho?: Array<{ upho?: string; uphoesio?: string }>;
}

interface WordCardProps {
  word: WordCardWord;
  onViewWord: (word: string, wordId?: string) => void;
}

/**
 * Shared word card used by the "Newly Coined Words" and "Newly Added Words"
 * sections. Both render the same fields (word, status, pronunciation, date)
 * and the same navigation-on-click behavior.
 */
export const WordCard = ({ word, onViewWord }: WordCardProps) => {
  const pronunciation = getPronunciation(word);
  const statusDisplay = getStatusDisplay(word.status);
  const dateAdded = formatDate(word.createdAt);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onViewWord(word.ota, word.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewWord(word.ota, word.id);
        }
      }}
      className="relative group cursor-pointer rounded-xl p-4 bg-[#D4E8EA] sm:p-5 flex flex-col min-h-[160px] border border-transparent transition-all duration-200"
    >
      {/* Top Row: Word + Status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0">
          {word.ota}
        </h3>
        <div
          className="shrink-0 rounded-md px-2.5 py-2 text-xs font-normal whitespace-nowrap"
          style={{
            backgroundColor: "#02474F",
            color: "#ffffff",
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
      <div className="flex items-center justify-between mt-auto pt-3 rounded-lg p-2">
        <p className="text-xs text-gray-500">Added - {dateAdded}</p>
        <span className="text-sm font-medium text-[#02474F] group-hover:underline">
          View Word
        </span>
      </div>
    </div>
  );
};
