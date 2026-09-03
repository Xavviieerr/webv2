"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSyncSearchQuery } from "../hooks/useSyncSearchQuery";
import { GenericSearchComponent } from "./genericSearchComponent";

export interface WordNotFoundViewProps {
  term: string;
  onGoBack: () => void;
  onSearch: (newTerm: string) => void;
}

/**
 * "Word not found" page for the dictionary: lets the user go back, re-search,
 * and explains that the term is not in the dictionary.
 */
export const WordNotFoundView = ({
  term,
  onGoBack,
  onSearch,
}: WordNotFoundViewProps) => {
  const { t } = useTranslation("common");

  // Sync current term to Redux so GenericSearchComponent shows it in the input
  useSyncSearchQuery(term);

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className=" mx-auto px-4 sm:px-6">
        {/* Go Back */}
        <button
          type="button"
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{t("goBack")}</span>
        </button>

        {/* Search — GenericSearchComponent (suggestions, history built-in) */}
        <div className="mb-6 w-full max-w-[928px] mx-auto min-w-0 px-4 sm:px-0">
          <GenericSearchComponent onSearchOnly={onSearch} />
        </div>

        {/* Search Results label */}
        <h2 className="text-[24px] font-medium text-gray-900 mb-8">
          {t("searchResultsFor")} &quot;{term || "..."}&quot;
        </h2>

        {/* Centered No Word Found block */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-[320px] aspect-4/3 mb-6">
            <Image
              src="/word-not-found.svg"
              alt="No word found"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t("noWordFound")}
          </h3>
          <p className="text-base text-gray-700">
            {t("wordNotInDictionary")}
          </p>
        </div>
      </div>
    </div>
  );
};