"use client";

import { useState, useMemo } from "react";
import { Star, MessageSquare, Pencil } from "lucide-react";
import { useGetPlaceReviewsQuery } from "../../api/placeEndpoints";
import { useAppSelector } from "@/types/hooks";
import { usePlaceOwnership } from "../../hooks/usePlaceOwnership";
import { SubmitReviewModal } from "../submit/submit-review-modal";
import { OfficialResponseForm } from "./official-response-form";
import type { PlaceListItem, PlaceReview } from "../../types";

interface ReviewsPanelProps {
	placeId: string;
	isBusiness: boolean;
	averageRating?: number;
	place: PlaceListItem;
}

export function ReviewsPanel({ placeId, isBusiness, averageRating = 0, place }: ReviewsPanelProps) {
	const [page, setPage] = useState(1);
	const user = useAppSelector((state) => state.auth.user);
	const { isOwner } = usePlaceOwnership(place);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [editingReview, setEditingReview] = useState<PlaceReview | null>(null);

	const { data, isLoading, refetch } = useGetPlaceReviewsQuery(
		{ placeId, params: { page, limit: 5 } },
		{ skip: !isBusiness },
	);

	const reviews = data?.items ?? [];
	const totalPages = data?.totalPages ?? 0;

	const userReview = useMemo(
		() => reviews.find((r) => r.userId === user?.id) ?? null,
		[reviews, user?.id],
	);

	if (!isBusiness) {
		return null;
	}

	const handleEditClick = (review: PlaceReview) => {
		setEditingReview(review);
		setShowReviewModal(true);
	};

	const handleNewReviewClick = () => {
		setEditingReview(null);
		setShowReviewModal(true);
	};

	const handleModalClose = () => {
		setShowReviewModal(false);
		setEditingReview(null);
	};

	return (
		<div className="bg-[#F2FEFF] rounded-2xl border border-[#02474F]/10 shadow-lg p-5 sm:p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
					Reviews ({data?.total ?? 0})
				</h2>
				{user && !userReview && (
					<button
						type="button"
						onClick={handleNewReviewClick}
						className="inline-flex items-center gap-1.5 rounded-lg bg-[#02474F] px-3.5 py-2 text-[13px] font-medium text-[#F5DEB3] transition-colors hover:bg-[#02474F]/90 cursor-pointer"
					>
						<MessageSquare className="w-3.5 h-3.5" />
						Write a Review
					</button>
				)}
				{user && userReview && (
					<button
						type="button"
						onClick={() => handleEditClick(userReview)}
						className="inline-flex items-center gap-1.5 rounded-lg bg-[#02474F] px-3.5 py-2 text-[13px] font-medium text-[#F5DEB3] transition-colors hover:bg-[#02474F]/90 cursor-pointer"
					>
						<Pencil className="w-3.5 h-3.5" />
						Edit Review
					</button>
				)}
			</div>

			{averageRating > 0 && (
				<div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#02474F]/5">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={`w-5 h-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
							/>
						))}
					</div>
					<span className="text-lg font-semibold text-[#0D4D4D]">{averageRating.toFixed(1)}</span>
					<span className="text-sm text-[#0D4D4D]/50">average</span>
				</div>
			)}

			{isLoading ? (
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="bg-[#D4E8EA]/70 rounded-xl p-4 border border-[#02474F]/10 animate-pulse">
							<div className="h-4 rounded w-1/3 mb-2" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="h-3 rounded w-full mb-1" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="h-3 rounded w-2/3" style={{ backgroundColor: "#8AA5A81A" }} />
						</div>
					))}
				</div>
			) : reviews.length === 0 ? (
				<p className="text-sm text-[#0D4D4D]/60 text-center py-6">
					No reviews yet. Be the first to review this place.
				</p>
			) : (
				<div className="space-y-3">
					{reviews.map((review) => {
						const isOwnReview = user?.id === review.userId;
						return (
							<div key={review.id} className="bg-[#D4E8EA]/70 rounded-xl p-4 border border-[#02474F]/10">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-[#0E808D]/10 flex items-center justify-center text-xs font-semibold text-[#0E808D]">
											{isOwnReview ? "Y" : "U"}
										</div>
										<div>
											<p className="text-sm font-semibold text-[#0D4D4D]">
												{isOwnReview ? "You" : "Anonymous User"}
											</p>
											<p className="text-[11px] text-[#02474F]/40">
												{new Date(review.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
									{isOwnReview && (
										<div className="flex items-center gap-1">
											<button
												type="button"
												onClick={() => handleEditClick(review)}
												className="p-1.5 rounded-lg text-[#0D4D4D]/40 hover:text-[#0E808D] hover:bg-[#0E808D]/10 transition-colors cursor-pointer"
												title="Edit review"
											>
												<Pencil className="w-3.5 h-3.5" />
											</button>
										</div>
									)}
										<div className="flex items-center gap-0.5">
											{Array.from({ length: 5 }).map((_, i) => (
												<Star
													key={i}
													className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
												/>
											))}
										</div>
									</div>
								</div>
								<p className="text-sm text-[#0D4D4D]/70 leading-relaxed">{review.comment}</p>

								{review.ownerResponse && (
									<div className="mt-3 ml-4 pl-4 border-l-4 border-[#02474F] bg-[#F2FEFF] rounded-r-lg p-3">
										<p className="text-[11px] font-semibold uppercase tracking-wide text-[#02474F] mb-1">Owner Response</p>
										<p className="text-sm text-[#0D4D4D]/70">{review.ownerResponse}</p>
									</div>
								)}

								{isOwner && !review.ownerResponse && (
									<OfficialResponseForm
										placeId={placeId}
										reviewId={review.id}
										onResponseSubmitted={() => refetch()}
									/>
								)}
							</div>
						);
					})}

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-3 pt-3">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page <= 1}
								className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							>
								Prev
							</button>
							<span className="text-sm text-[#0D4D4D]/70 px-2">Page {page} of {totalPages}</span>
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page >= totalPages}
								className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
							>
								Next
							</button>
						</div>
					)}
				</div>
			)}

			<SubmitReviewModal
				open={showReviewModal}
				onClose={handleModalClose}
				placeId={placeId}
				existingReview={editingReview ? { id: editingReview.id, rating: editingReview.rating, comment: editingReview.comment } : undefined}
			/>
		</div>
	);
}
