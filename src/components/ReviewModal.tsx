"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaStar, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitWordReviewMutation } from "@/slice/endpoints";
import ButtonSpinner from "./ButtonSpinner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordId: string;
  wordName: string;
  onSuccess?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  wordId,
  wordName,
  onSuccess,
}) => {
  const { t } = useTranslation("common");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitReview, { isLoading: isSubmitting }] = useSubmitWordReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await submitReview({ wordId, rating, review }).unwrap();
      setRating(0);
      setReview("");
      onSuccess?.();
      onClose();
    } catch {
      // Toast handled in mutation
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#05353A]">
              {t("rateAndReview")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Word Name */}
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-[#05353A]">
              {wordName.charAt(0).toUpperCase() + wordName.slice(1)}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <FaStar
                  size={32}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("yourReview")}
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={t("writeYourReview")}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#05353A] focus:ring-2 focus:ring-[#05353A]/20 transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-[#05353A] text-white py-3 rounded-xl font-semibold hover:bg-[#065a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  <span>{t("submitting")}</span>
                </>
              ) : (
                t("submitReview")
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;

