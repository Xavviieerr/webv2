"use client";

import { useRouter } from "next/navigation";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-4">
      <div className="rounded-xl bg-red-500/10 p-4">
        <IconAlertTriangle className="size-8 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-[#1A4349]">
        Something went wrong
      </h2>
      <p className="text-sm text-[#1A4349]/60 max-w-md">
        {error.message || "An unexpected error occurred in the dashboard."}
      </p>
      {error?.digest && (
        <p className="text-xs text-[#1A4349]/40">
          Error reference: {error.digest}
        </p>
      )}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] px-4 py-2 text-sm font-medium text-[#1A4349] transition-colors hover:bg-[#D4E8EA]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
