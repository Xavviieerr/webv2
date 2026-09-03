"use client";

import React, { useState } from "react";
import { AllWords } from "./AllWords";
import { useWordSearch } from "../hooks/useWordSearch";
import { WelcomeToDictionary } from "./home/WelcomeToDictionary";
import { WordOfDayCard } from "./home/WordOfDayCard";
import { NewlyCoinedWordSection } from "./home/NewlyCoinedWordSection";
import NewlyAddedWords from "./NewlyAddedWords";

export const Dictionary = () => {
  const [showAllWords, setShowAllWords] = useState(false);
  const { openWordDetails } = useWordSearch();

  const handleSearch = (query: string) => {
    const q = query.trim();
    if (q) {
      openWordDetails(q, true);
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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
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
