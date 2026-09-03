"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRespondToReviewMutation } from "../../api/placeEndpoints";

interface OfficialResponseFormProps {
	placeId: string;
	reviewId: string;
	onResponseSubmitted?: () => void;
}

export function OfficialResponseForm({ placeId, reviewId, onResponseSubmitted }: OfficialResponseFormProps) {
	const [respondToReview, { isLoading }] = useRespondToReviewMutation();
	const [response, setResponse] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!response.trim()) {
			setError("Response is required");
			return;
		}

		try {
			await respondToReview({ placeId, reviewId, body: { response: response.trim() } }).unwrap();
			toast.success("Response submitted!");
			setResponse("");
			setShowForm(false);
			setError("");
			onResponseSubmitted?.();
		} catch (err: unknown) {
			const apiError = err as { data?: { message?: string }; message?: string };
			const msg = apiError?.data?.message || apiError?.message || "Failed to submit response";
			toast.error(msg);
			setError(msg);
		}
	};

	if (!showForm) {
		return (
			<button
				type="button"
				onClick={() => setShowForm(true)}
				className="text-xs text-[#0E808D] font-medium hover:underline cursor-pointer mt-2"
			>
				Respond as owner
			</button>
		);
	}

	return (
		<div className="mt-3 ml-4 pl-4 border-l-4 border-[#02474F] bg-[#F2FEFF] rounded-r-lg p-3">
			<textarea
				value={response}
				onChange={(e) => {
					setResponse(e.target.value);
					setError("");
				}}
				placeholder="Write your official response..."
				rows={3}
				className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none mb-2"
			/>
			{error && <p className="text-red-500 text-xs mb-2">{error}</p>}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => {
						setShowForm(false);
						setResponse("");
						setError("");
					}}
					className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1.5 text-xs font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/50 transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0E808D]/90 transition-colors disabled:opacity-50 cursor-pointer"
				>
					{isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
					{isLoading ? "Submitting..." : "Submit Response"}
				</button>
			</div>
		</div>
	);
}
