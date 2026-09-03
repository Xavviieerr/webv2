"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Textarea from "@/components/ui/TextArea";
import { Star, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  useGetWordReviewsQuery,
  useSubmitWordReviewMutation,
} from "@/slice/wordEndpoints";
import { useLazyGetUserByIdQuery } from "@/slice/userEndpoints";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  profilePictureUrl?: string;
}


interface RatingandReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWriteReview: () => void;
  wordId: string;
}

export const RatingandReviewModal = ({
  open,
  onOpenChange,
  onWriteReview,
  wordId,
}: RatingandReviewModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [userCache, setUserCache] = useState<Record<string, { firstName: string; lastName: string; username: string; profilePictureUrl?: string }>>({});
  const [fetchUser] = useLazyGetUserByIdQuery();

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading, refetch } = useGetWordReviewsQuery(wordId, {
    skip: !open || !wordId,
  });

  // Memoize reviews to fix exhaustive-deps warnings
  const memoizedReviews = useMemo(() => {
    return reviewsData?.data || [];
  }, [reviewsData?.data]);

  // Fetch user data for each review
  useEffect(() => {
    if (memoizedReviews.length > 0) {
      memoizedReviews.forEach((review) => {
        if (!userCache[review.userId] && review.userId) {
          fetchUser(review.userId).then((result) => {
            if (result.data) {
              setUserCache((prev) => ({
                ...prev,
                [review.userId]: result.data!,
              }));
            }
          });
        }
      });
    }
  }, [memoizedReviews, userCache, fetchUser]);

  // Calculate rating stats from reviews
  const ratingStats = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    const nonReplyReviews = memoizedReviews.filter((r) => !r.isReply);

    nonReplyReviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
      totalRating += review.rating;
    });

    const average = nonReplyReviews.length > 0 ? totalRating / nonReplyReviews.length : 0;

    return {
      average,
      totalReviews: nonReplyReviews.length,
      distribution,
    };
  }, [memoizedReviews]);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Recently";
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 Day Ago";
      if (diffDays < 7) return `${diffDays} Days Ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? "Week" : "Weeks"} Ago`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? "Month" : "Months"} Ago`;
      }
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "Year" : "Years"} Ago`;
    } catch {
      return "Recently";
    }
  };

  // Transform API reviews to component format
  const transformedReviews: Review[] = memoizedReviews
    .filter((r) => !r.isReply)
    .map((review) => {
      const user = userCache[review.userId];
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const userName = firstName && lastName ? `${firstName} ${lastName}` : user?.username || "Anonymous";
      const initials = firstName && lastName
        ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
        : user?.username?.substring(0, 2).toUpperCase() || "AN";

      return {
        id: review.id,
        userId: review.userId,
        userName,
        userInitials: initials,
        rating: review.rating,
        comment: review.review,
        date: formatDate(review.createdAt),
        profilePictureUrl: user?.profilePictureUrl,
      };
    });

  // Sort reviews - need to use original createdAt for sorting
  const sortedReviews = useMemo(() => {
    const sorted = [...transformedReviews];
    // Map back to original reviews for date sorting
    const reviewsWithDates = sorted.map((review) => {
      const originalReview = memoizedReviews.find((r) => r.id === review.id);
      return { ...review, createdAt: originalReview?.createdAt || "" };
    });

    switch (sortBy) {
      case "oldest":
        return reviewsWithDates.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return reviewsWithDates.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return reviewsWithDates.sort((a, b) => a.rating - b.rating);
      default: // newest
        return reviewsWithDates.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [transformedReviews, sortBy, memoizedReviews]);

  const reviewsPerPage = 4;
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Refetch when modal opens
  useEffect(() => {
    if (open && wordId) {
      refetch();
    }
  }, [open, wordId, refetch]);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getProgressPercentage = (count: number) => {
    return (count / ratingStats.totalReviews) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white px-4 sm:px-6">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#02474F] text-left">
                Ratings & Reviews
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1 text-left">
                Based on community feedback.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by newest review" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort by newest review</SelectItem>
              <SelectItem value="oldest">Sort by oldest review</SelectItem>
              <SelectItem value="highest">Sort by highest rating</SelectItem>
              <SelectItem value="lowest">Sort by lowest rating</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={onWriteReview}
            className="w-full sm:w-auto bg-[#02474F] text-white hover:bg-[#0E808D]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </div>

        {/* Rating Summary */}
        <div className="bg-[#F0F9FA] rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4 md:gap-8">
            {/* Average Rating */}
            <div className="text-center md:text-left md:min-w-[180px]">
              <div className="text-4xl sm:text-5xl font-bold text-[#02474F] mb-2">
                {ratingStats.average.toFixed(1)}
              </div>
              <div className="mb-2">{renderStars(Math.round(ratingStats.average), "lg")}</div>
              <div className="text-sm text-gray-600">
                ({ratingStats.totalReviews} Reviews)
              </div>
            </div>

            {/* Star Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((starCount) => {
                const count = ratingStats.distribution[starCount as keyof typeof ratingStats.distribution];
                const percentage = getProgressPercentage(count);
                return (
                  <div key={starCount} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-12">{starCount} stars</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedReviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-3 sm:gap-4 pb-4 border-b border-gray-100"
              >
                <Avatar className="mt-1 bg-[#B3E0E6] text-[#02474F]">
                  {review.profilePictureUrl ? (
                    <AvatarImage src={review.profilePictureUrl} alt={review.userName} />
                  ) : null}
                  <AvatarFallback className="bg-[#B3E0E6] text-[#02474F] font-semibold">
                    {review.userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 wrap-break-word">
                        {review.userName}
                      </div>
                      <div className="mb-2">{renderStars(review.rating, "sm")}</div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">
                        {review.comment}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-4">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-[#02474F] text-white hover:bg-[#0E808D]"
                    : "text-gray-700"
                }`}
              >
                {String(page).padStart(2, "0")}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface LeaveAReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, review: string) => void;
  wordId: string;
}

export const LeaveAReviewModal = ({
  open,
  onOpenChange,
  onSubmit,
  wordId,
}: LeaveAReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitReview, { isLoading: isSubmitting }] = useSubmitWordReviewMutation();

  const handleSubmit = async () => {
    if (rating > 0 && reviewText.trim() && wordId) {
      try {
        await submitReview({
          wordId,
          rating,
          review: reviewText.trim(),
        }).unwrap();
        onSubmit(rating, reviewText);
        setRating(0);
        setReviewText("");
        setHoveredRating(0);
        onOpenChange(false);
      } catch (error) {
        // Error is handled by toast in the mutation
        console.error("Failed to submit review:", error);
      }
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setRating(0);
      setReviewText("");
      setHoveredRating(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            Leave a Review
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            How would you rate this word?
          </DialogDescription>
        </DialogHeader>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Review Text Area */}
        <div className="space-y-2">
          <Textarea
            placeholder="Write a review...."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || !reviewText.trim() || isSubmitting}
          className="w-full bg-[#02474F] text-white hover:bg-[#0E808D] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};