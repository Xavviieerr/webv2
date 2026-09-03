"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEW_SORT_OPTIONS, ReviewSortOption } from "../../constants/wordDetails";
import { useWordReviews } from "../../hooks/useWordReviews";

interface RatingsAndReviewsPanelProps {
  wordId: string;
}

export const RatingsAndReviewsPanel = ({ wordId }: RatingsAndReviewsPanelProps) => {
  const {
    reviews: paginatedReviews,
    isLoading: reviewsLoading,
    ratingStats,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useWordReviews(wordId);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  const getProgressPercentage = (count: number) =>
    ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#02474F]">Ratings & Reviews</h3>
        <p className="text-sm text-gray-600 mt-1">Based on community feedback.</p>
      </div>

      <Select value={sortBy} onValueChange={(v) => setSortBy(v as ReviewSortOption)}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by newest review" />
        </SelectTrigger>
        <SelectContent>
          {REVIEW_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

        <div className="bg-[#E6F7F8] rounded-lg p-4 sm:p-6 border border-[#9EC9CC]">
        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4 md:gap-8">
          <div className="text-center md:text-left md:min-w-[180px]">
            <div className="text-4xl sm:text-5xl font-bold text-[#02474F] mb-2">{ratingStats.average.toFixed(1)}</div>
            <div className="mb-2">{renderStars(Math.round(ratingStats.average), "lg")}</div>
            <div className="text-sm text-gray-600">({ratingStats.totalReviews} Reviews)</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((starCount) => {
              const count = ratingStats.distribution[starCount as keyof typeof ratingStats.distribution];
              const percentage = getProgressPercentage(count);
              return (
                <div key={starCount} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-12">{starCount} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {reviewsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedReviews.length > 0 ? (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div key={review.id} className="flex gap-3 sm:gap-4 pb-4 border-b border-gray-100">
              <Avatar className="mt-1 bg-[#B3E0E6] text-[#02474F]">
                {review.profilePictureUrl ? <AvatarImage src={review.profilePictureUrl} alt={review.userName} /> : null}
                <AvatarFallback className="bg-[#B3E0E6] text-[#02474F] font-semibold">{review.userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 mb-1">{review.userName}</div>
                    <div className="mb-2">{renderStars(review.rating, "sm")}</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-4">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No reviews yet. Be the first to review below!</p>
        </div>
      )}

      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-8 w-8 ${currentPage === page ? "bg-[#02474F] text-white hover:bg-[#0E808D]" : "text-gray-700"}`}
            >
              {String(page).padStart(2, "0")}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
