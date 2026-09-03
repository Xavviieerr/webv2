"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-3 py-8">
			<button
				type="button"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
				className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
			>
				<ChevronLeft className="w-4 h-4" />
				Prev
			</button>
			<span className="text-sm text-[#0D4D4D]/70 px-2">
				Page {page} of {totalPages}
			</span>
			<button
				type="button"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages}
				className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
			>
				Next
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}
