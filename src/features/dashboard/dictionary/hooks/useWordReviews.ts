"use client";

import { useEffect, useMemo, useState } from "react";

import { useGetWordReviewsQuery } from "@/slice/wordEndpoints";
import { useLazyGetUserByIdQuery } from "@/slice/userEndpoints";

import { REVIEWS_PAGE_SIZE, ReviewSortOption } from "../constants/wordDetails";
import { Review } from "../types/reviews";
import { formatRelativeDate } from "../utils/formatDate";

/**
 * Fetch + derive all review data for the ratings panel: user metadata
 * enrichment, average/star distribution, sorting, and pagination.
 */
export function useWordReviews(wordId: string) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<ReviewSortOption>("newest");
  const [userCache, setUserCache] = useState<
    Record<
      string,
      { firstName: string; lastName: string; username: string; profilePictureUrl?: string }
    >
  >({});

  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetWordReviewsQuery(wordId, { skip: !wordId });

  const [fetchUser] = useLazyGetUserByIdQuery();

  const memoizedReviews = useMemo(() => reviewsData?.data || [], [reviewsData?.data]);

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

  const ratingStats = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    const nonReplyReviews = memoizedReviews.filter((r) => !r.isReply);
    nonReplyReviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
      totalRating += review.rating;
    });
    const average =
      nonReplyReviews.length > 0 ? totalRating / nonReplyReviews.length : 0;
    return { average, totalReviews: nonReplyReviews.length, distribution };
  }, [memoizedReviews]);

  const transformedReviews: Review[] = memoizedReviews
    .filter((r) => !r.isReply)
    .map((review) => {
      const user = userCache[review.userId];
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const userName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : user?.username || "Anonymous";
      const initials =
        firstName && lastName
          ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
          : user?.username?.substring(0, 2).toUpperCase() || "AN";
      return {
        id: review.id,
        userId: review.userId,
        userName,
        userInitials: initials,
        rating: review.rating,
        comment: review.review,
        date: formatRelativeDate(review.createdAt),
        profilePictureUrl: user?.profilePictureUrl,
      };
    });

  const sortedReviews = useMemo(() => {
    const withDates = transformedReviews.map((review) => ({
      ...review,
      createdAt: memoizedReviews.find((m) => m.id === review.id)?.createdAt || "",
    }));

    switch (sortBy) {
      case "oldest":
        return [...withDates].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "highest":
        return [...withDates].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...withDates].sort((a, b) => a.rating - b.rating);
      default:
        return [...withDates].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }, [transformedReviews, sortBy, memoizedReviews]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PAGE_SIZE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PAGE_SIZE,
    currentPage * REVIEWS_PAGE_SIZE,
  );

  return {
    reviews: paginatedReviews,
    isLoading: reviewsLoading,
    ratingStats,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
