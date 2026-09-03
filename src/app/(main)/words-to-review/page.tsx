"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppSelector } from "@/types/hooks";
import { useWordsToReviewQuery } from "@/slice/endpoints";
import { WordToReview } from "@/types";
import WordReviewCard from "@/components/WordReviewCard";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ButtonSpinner from "@/components/ButtonSpinner";
import ReviewModal from "@/components/ReviewModal";

const WordsToReviewPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<WordToReview | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading: loading } = useWordsToReviewQuery(
    { page: currentPage, limit: 12 },
    { skip: !user }
  );

  const words = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
  }, [user, router]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (word: WordToReview) => {
    setSelectedWord(word);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    // List will refetch via cache invalidation from submitWordReview
  };

  return (
    <div className="min-h-screen bg-[#f2feff]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#05353A] mb-2">
            {t("wordsToReview")}
          </h1>
          <p className="text-gray-600">
            {t("shareKnowledgePrompt")}
          </p>
        </motion.div>

        {/* Words Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ButtonSpinner />
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t("noWordsToReview")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {words.map((word, index) => (
                <WordReviewCard
                  key={word.id}
                  word={word}
                  index={index}
                  onClick={() => handleCardClick(word)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#05353A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <FaChevronLeft size={12} />
                  <span>{t("back")}</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage
                          ? "bg-[#05353A] text-white"
                          : "bg-white border border-gray-200 text-[#05353A] hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#05353A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span>{t("continue")}</span>
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

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
    </div>
  );
};

export default WordsToReviewPage;

