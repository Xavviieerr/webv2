"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface FiguresPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FiguresPagination({
  currentPage,
  totalPages,
  onPageChange,
}: FiguresPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <IconChevronLeft size={16} />
        Previous
      </button>
      <span className="text-sm text-[#0D4D4D]/70 px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <IconChevronRight size={16} />
      </button>
    </div>
  );
}
