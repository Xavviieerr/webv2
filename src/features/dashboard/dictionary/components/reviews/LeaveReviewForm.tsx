"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/TextArea";
import { Star } from "lucide-react";
import { useSubmitWordReviewMutation } from "@/slice/wordEndpoints";

interface LeaveReviewFormProps {
  wordId: string;
  onSubmitSuccess: () => void;
}

export const LeaveReviewForm = ({ wordId, onSubmitSuccess }: LeaveReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitReview, { isLoading: isSubmitting }] = useSubmitWordReviewMutation();

  const handleSubmit = async () => {
    if (rating > 0 && reviewText.trim() && wordId) {
      try {
        await submitReview({ wordId, rating, review: reviewText.trim() }).unwrap();
        setRating(0);
        setReviewText("");
        setHoveredRating(0);
        onSubmitSuccess();
      } catch (e) {
        console.error("Failed to submit review:", e);
      }
    }
  };

  return (
    <div className="space-y-4 ">
      <h3 className="text-lg font-bold text-[#02474F]">Leave a Review</h3>
      <p className="text-sm text-gray-600">How would you rate this word?</p>

      <div className="flex justify-center gap-1 py-2" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star <= rating}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Write a review...."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="min-h-[120px] resize-none"
        aria-label="Review text"
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || !reviewText.trim() || isSubmitting}
        className="w-full bg-[#02474F] text-white hover:bg-[#0E808D] disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
};
