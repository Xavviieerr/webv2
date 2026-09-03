"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SearchError({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <AlertTriangle
        size={48}
        strokeWidth={1.2}
        className="text-amber-500/70"
      />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-slate-700">
          {t("somethingWentWrong")}
        </p>
        <p className="text-sm text-slate-600/70">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={14} />
          {t("tryAgain")}
        </button>
      )}
    </div>
  );
}
