"use client";

import { Suspense } from "react";
import { NotificationPageContainer } from "@/features/dashboard/notifications";

function NotificationPageFallback() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#1A4349]/10" />
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-[#1A4349]/10" />
          <div className="h-3 w-24 rounded bg-[#1A4349]/5" />
        </div>
      </div>
      <div className="rounded-xl border border-[#1A4349]/10 bg-[#F9FAFB] p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="mt-0.5 size-9 shrink-0 rounded-full bg-[#1A4349]/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-[#1A4349]/10" />
              <div className="h-3 w-1/2 rounded bg-[#1A4349]/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationPageWrapper() {
  return (
    <Suspense fallback={<NotificationPageFallback />}>
      <NotificationPageContainer />
    </Suspense>
  );
}
