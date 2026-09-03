"use client";

import { IconMapPin, IconPlus } from "@tabler/icons-react";

interface EmptyStateProps {
	hasFilters: boolean;
	onSuggestPlace: () => void;
	onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onSuggestPlace, onClearFilters }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
				<IconMapPin className="w-8 h-8 text-[#0E808D]" />
			</div>
			<h3 className="text-lg font-semibold text-[#0D4D4D] mb-2">
				{hasFilters ? "No places found" : "No places yet"}
			</h3>
			<p className="text-sm text-[#0D4D4D]/60 max-w-xs mb-6">
				{hasFilters
					? "Try adjusting your filters or search terms."
					: "Be the first to suggest a significant Urhobo location."}
			</p>
			<div className="flex items-center gap-3">
				{hasFilters && (
					<button
						type="button"
						onClick={onClearFilters}
						className="inline-flex items-center gap-1.5 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-2 text-sm font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/50 transition-colors cursor-pointer"
					>
						Clear filters
					</button>
				)}
				<button
					type="button"
					onClick={onSuggestPlace}
					className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 cursor-pointer"
				>
					<IconPlus className="w-4 h-4" />
					Suggest Place
				</button>
			</div>
		</div>
	);
}
