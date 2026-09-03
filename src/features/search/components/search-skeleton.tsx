"use client";

import React from "react";

const SkeletonBar = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-secondary-foreground/10 rounded-lg ${className}`}
  />
);

export function SearchSkeleton() {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Word skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`word-${i}`} className="flex flex-col gap-1 pb-3">
          <div className="flex items-center gap-2">
            <SkeletonBar className="w-9 h-9 rounded-full shrink-0" />
            <SkeletonBar className="h-5 w-48" />
          </div>
          <SkeletonBar className="h-4 w-full max-w-md" />
        </div>
      ))}

      {/* Figure skeletons */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={`fig-${i}`} className="flex flex-col gap-1 pb-3">
          <div className="flex items-center gap-2">
            <SkeletonBar className="w-9 h-9 rounded-full shrink-0" />
            <SkeletonBar className="h-5 w-40" />
          </div>
          <SkeletonBar className="h-4 w-full max-w-sm" />
        </div>
      ))}
    </div>
  );
}
