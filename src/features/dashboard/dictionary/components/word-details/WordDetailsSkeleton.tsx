"use client";

import React from "react";

/**
 * Loading skeleton for the word-details page.
 * Renders animated placeholder cards matching the updated dictionary card styling
 * (light teal background #D4E8EA, dark teal border #9EC9CC, rounded-xl).
 */
export function WordDetailsSkeleton() {
  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Word Header Skeleton */}
        <div className="mb-8 bg-white rounded-xl p-4 sm:p-6 border border-[#9EC9CC] animate-pulse">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span className="w-32 h-6 bg-gray-300 rounded mb-2"></span>
            <span className="flex-1 h-6 bg-gray-300 rounded"></span>
          </div>
          <div className="flex items-baseline gap-3 mt-3 flex-wrap">
            <span className="h-6 bg-gray-300 rounded w-24"></span>
            <span className="h-4 bg-gray-300 rounded w-1/2"></span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              type="button"
              className="p-1 rounded-full bg-white/20 hover:bg-white/25 transition-colors shrink-0"
              aria-label="Listen to pronunciation"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1B6A71" }}
            >
              Pronunciation
            </button>
          </div>
        </div>

        {/* Sense Cards Skeleton (desktop) */}
        <div className="hidden lg:block mb-8">
          <div className="h-[90vh] min-h-[400px] w-full overflow-y-auto">
            <div className="pb-8">
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative rounded-xl p-6 border border-[#9EC9CC] bg-[#D4E8EA] animate-pulse"
                  >
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2 mb-auto"></div>
                    <div className="h-4 bg-white/20 rounded w-full mt-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Skeleton (desktop) */}
        <div className="hidden lg:block h-[90vh] min-h-[400px] w-full overflow-y-auto">
          <div className="pb-8">
            <div className="bg-[#D4E8EA] rounded-xl p-4 sm:p-6 border border-[#9EC9CC] animate-pulse">
              <div className="text-4xl sm:text-5xl font-bold text-[#02474F] mb-2">8.5</div>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.37.922c.381.875.746 1.532 1.146 2.023l.323 1.239c-.282.801-.98.998-1.485.71l-.298-.303a1.053 1.053 0 0 0-1.485.22l-.257 1.106c-.2.82-.444 1.562-.616 2.37a1.113 1.113 0 0 1-.276 1.082l-.324.65c-.2.82-.444 1.562-.615 2.37a1.113 1.113 0 0 1-.276 1.082l-.323.65c-.2.82-.443 1.562-.615 2.37a1.113 1.113 0 0 1-.276 1.082l-.323.65c-.2.82-.443 1.562-.615 2.37a1.113 1.113 0 0 1-.276 1.082l.324.65a1.134 1.134 0 0 1 .22 1.318l.323.123c.31.118.6.178.875.178.318 0 .588-.118.822-.354.24-.236.4-.472.43-.782v-1.9l-8.257.008Z" />
                  </svg>
                ))}
              </div>
              {/* Progress bars */}
              {[5, 4, 3, 2, 1].map((starCount) => (
                <div key={starCount} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-12">{starCount} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: `${40}%` }} />
                  </div>
                  <span className="text-sm text-gray-700 w-8 text-right">{Math.round(40)}</span>
                </div>
              ))}
              {/* Reviews count */}
              <div className="text-sm text-gray-600">(12 Reviews)</div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="block lg:hidden mb-8 space-y-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="relative rounded-xl p-6 border border-[#9EC9CC] bg-[#D4E8EA] animate-pulse"
            >
              <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-1/2 mb-auto"></div>
              <div className="h-4 bg-white/20 rounded w-full mt-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}