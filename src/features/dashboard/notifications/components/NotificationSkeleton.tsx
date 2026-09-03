"use client";

import { cn } from "@/lib/utils";

interface NotificationSkeletonProps {
  count?: number;
  className?: string;
}

export function NotificationSkeleton({ count = 5, className }: NotificationSkeletonProps) {
  return (
    <div className={cn("flex flex-col", className)} role="status" aria-label="Loading notifications">
      <span className="sr-only">Loading notifications...</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-3 py-3 animate-pulse">
          <div className="mt-0.5 size-9 shrink-0 rounded-full bg-[#1A4349]/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-[#1A4349]/10" />
            <div className="h-3 w-1/2 rounded bg-[#1A4349]/5" />
            <div className="h-2.5 w-16 rounded bg-[#1A4349]/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
