"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SearchEmpty({ query }: { query: string }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <SearchX
        size={48}
        strokeWidth={1.2}
        className="text-slate-600/40"
      />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-slate-700">
          {t("noResultsFound")}
        </p>
        <p className="text-sm text-slate-600/70">
          {t("noResultsFoundFor")}&quot;{query}&quot;. {t("tryDifferentSearchTerm")}
        </p>
      </div>
    </div>
  );
}
