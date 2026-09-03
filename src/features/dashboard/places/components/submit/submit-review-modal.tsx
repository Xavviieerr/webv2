"use client";

import { useState, useEffect } from "react";
import { IconX, IconLoader2 } from "@tabler/icons-react";
import { Star } from "lucide-react";
import { useSubmitReviewMutation, useUpdateReviewMutation } from "../../api/placeEndpoints";
import { submitReviewSchema } from "../../schemas/placeSchema";

interface ExistingReview {
	id: string;
	rating: number;
	comment: string;
}

interface SubmitReviewModalProps {
	open: boolean;
	onClose: () => void;
	placeId: string;
	existingReview?: ExistingReview;
}

export function SubmitReviewModal({ open, onClose, placeId, existingReview }: SubmitReviewModalProps) {
	const isEditMode = !!existingReview;
	const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
	const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
	const isLoading = isSubmitting || isUpdating;

	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [comment, setComment] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (open && existingReview) {
			setRating(existingReview.rating);
			setComment(existingReview.comment);
		}
	}, [open, existingReview]);

	const resetForm = () => {
		setRating(0);
		setHoverRating(0);
		setComment("");
		setErrors({});
		setSubmitted(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async () => {
		const result = submitReviewSchema.safeParse({ rating, comment });
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as string;
				fieldErrors[field] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		try {
			if (isEditMode) {
				await updateReview({ placeId, reviewId: existingReview.id, body: result.data }).unwrap();
			} else {
				await submitReview({ placeId, body: result.data }).unwrap();
			}
			setSubmitted(true);
		} catch {
			setErrors({ submit: isEditMode ? "Failed to update review. Please try again." : "Failed to submit review. Please try again." });
		}
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="fixed inset-0 bg-black/50" onClick={handleClose} />
			<div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
				<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10 shrink-0">
					<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
						{submitted
							? (isEditMode ? "Thank You!" : "Thank You!")
							: (isEditMode ? "Edit Review" : "Write a Review")}
					</h2>
					<button
						type="button"
						onClick={handleClose}
						className="rounded-lg p-1.5 text-[#0D4D4D]/50 hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D] transition-colors cursor-pointer"
					>
						<IconX size={16} />
					</button>
				</div>

				{submitted ? (
					<div className="flex flex-col items-center py-8 px-6 text-center">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
							<svg className="w-8 h-8 text-[#0E808D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-[#0D4D4D] mb-1">
							{isEditMode ? "Review Updated!" : "Review Submitted!"}
						</h3>
						<p className="text-sm text-[#0D4D4D]/60 max-w-xs">
							{isEditMode ? "Your review has been updated." : "Thank you for your review."}
						</p>
						<button
							type="button"
							onClick={handleClose}
							className="mt-6 text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5 text-sm font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer"
						>
							Done
						</button>
					</div>
				) : (
					<div className="flex flex-col overflow-y-auto flex-1 min-h-0 custom-scrollbar">
						<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
							<label className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">Rating *</label>
							<div className="flex items-center gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<button
										key={i}
										type="button"
										onClick={() => setRating(i + 1)}
										onMouseEnter={() => setHoverRating(i + 1)}
										onMouseLeave={() => setHoverRating(0)}
										className="cursor-pointer"
									>
										<Star
											className={`w-7 h-7 transition-colors ${
												(hoverRating || rating) > i
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									</button>
								))}
							</div>
							{errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
						</div>

						<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
							<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Your Review *</label>
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Share your experience..."
								rows={4}
								className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]"
							/>
							{errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
						</div>

						{errors.submit && (
							<div className="px-5 sm:px-6 py-2">
								<p className="text-red-500 text-sm">{errors.submit}</p>
							</div>
						)}

						<div className="px-5 sm:px-6 py-4 flex items-center justify-end shrink-0">
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isLoading}
								className="inline-flex items-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 cursor-pointer"
							>
								{isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
								{isLoading
									? (isEditMode ? "Updating..." : "Submitting...")
									: (isEditMode ? "Update Review" : "Submit Review")}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
