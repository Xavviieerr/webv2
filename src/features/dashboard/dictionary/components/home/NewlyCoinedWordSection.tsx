"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNewlyCoinedWordsQuery } from "@/slice/wordEndpoints";
import { WordCard } from "../WordCard";
import { WordReviewModal } from "../reviews/WordReviewModal";
import { buildWordDetailsHref } from "../../utils/buildWordDetailsHref";

interface SelectedWord {
  id: string;
  ota: string;
  status: string;
  oho?: Array<{ upho?: string; uphoesio?: string }>;
}

export const NewlyCoinedWordSection = () => {
  const router = useRouter();
  const { data: newlyCoinedWordsData, isLoading } = useNewlyCoinedWordsQuery();
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);

  const words = newlyCoinedWordsData || [];

  const handleViewWord = useCallback(
    (word: { id: string; ota: string; status: string }) => {
      if (word.status?.toLowerCase() === "approved") {
        router.push(buildWordDetailsHref(word.ota, false, word.id));
      } else {
        setSelectedWord(word);
      }
    },
    [router],
  );

  return (
    <section className="w-full py-8">
      {/* Header Tag */}
      <div className="lg:mb-6 flex justify-center">
        <div
          className="inline-block rounded-xl py-2.5 px-4 text-center bg-[#D4E8EA]"
        >
          <h2 className="text-base sm:text-lg font-medium text-[#0D4D4D]">
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
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onViewWord={() => handleViewWord(word)}
            />
          ))}
        </div>
      )}

      <WordReviewModal
        open={selectedWord !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedWord(null);
        }}
        word={selectedWord ?? { id: "", ota: "", status: "" }}
      />
    </section>
  );
};
