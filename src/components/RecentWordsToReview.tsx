"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { useAppSelector } from "@/types/hooks";
import { useWordsToReviewQuery } from "@/slice/endpoints";
import { WordToReview } from "@/types";
import WordReviewCard from "./WordReviewCard";
import ReviewModal from "./ReviewModal";

interface RecentWordsToReviewProps {
  variant?: "light" | "dark";
}

const RecentWordsToReview: React.FC<RecentWordsToReviewProps> = ({ variant = "light" }) => {
  const { t } = useTranslation("common");
  const [selectedWord, setSelectedWord] = useState<WordToReview | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading: loading } = useWordsToReviewQuery(
    { page: 1, limit: 3 },
    { skip: !user }
  );

  const words = data?.data ?? [];

  const handleCardClick = (word: WordToReview) => {
    setSelectedWord(word);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {};

  // Don't show if no user
  if (!user) {
    return null;
  }

  // Don't show anything while loading - wait until we know if there are words
  if (loading) {
    return null;
  }

  // Don't show if no words after loading completes
  if (words.length === 0) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`w-full max-w-4xl mx-auto mt-7 px-4 ${isDark ? "text-white" : ""}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-[#05353A]"}`}>
          {t("recentWordsToReview")}
        </h2>
        <Link
          href="/words-to-review"
          className={`flex items-center gap-1 text-sm font-medium hover:underline ${
            isDark ? "text-white/80 hover:text-white" : "text-[#05353A] hover:text-[#065a63]"
          }`}
        >
          {t("seeAllWordsToReview")}
          <FaChevronRight size={10} />
        </Link>
      </div>

      {/* Words Grid - Horizontal scroll on mobile, grid on larger screens */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
          {words.map((word, index) => (
            <div key={word.id} className="min-w-[280px] sm:min-w-0">
              <WordReviewCard 
                word={word} 
                index={index} 
                onClick={() => handleCardClick(word)}
              />
            </div>
          ))}
        </div>

      {/* Review Modal */}
      {selectedWord && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedWord(null);
          }}
          wordId={selectedWord.id}
          wordName={selectedWord.ota}
          onSuccess={handleReviewSuccess}
        />
      )}
    </motion.section>
  );
};

export default RecentWordsToReview;

