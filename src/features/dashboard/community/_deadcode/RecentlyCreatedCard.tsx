// @ts-nocheck
"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useNewlyCoinedWordsQuery } from "@/slice/wordEndpoints";

export function RecentlyCreatedCard() {
  const { t } = useTranslation("common");
  const { data: words = [], isLoading } = useNewlyCoinedWordsQuery();

  const recentWords = words.slice(0, 3);

  return (
    <div className="rounded-xl border border-[#0D4D4D]/10 bg-[#D4E8EA]/70 p-5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
        {t("recentlyCreated", "Recently Created")}
      </span>

      {isLoading ? (
        <div className="mt-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
              <div className="h-3 w-1/2 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
            </div>
          ))}
        </div>
      ) : recentWords.length > 0 ? (
        <div className="mt-3 flex flex-col gap-3">
          {recentWords.map((word) => (
            <div key={word.id}>
              <p className="text-sm font-medium text-[#0D4D4D]">{word.ota}</p>
              {word.oho?.[0]?.uphoesio && (
                <p className="text-[11px] text-[#0D4D4D]/50 italic">
                  /{word.oho[0].uphoesio}/
                </p>
              )}
            </div>
          ))}
          <Link
            href="/dashboard/dictionary"
            className="text-xs font-medium text-[#0E808D] hover:text-[#0E808D]/80 transition-colors mt-1"
          >
            {t("viewAllWords", "View All Words")} &rarr;
          </Link>
        </div>
      ) : (
        <p className="text-xs text-[#0D4D4D]/50 mt-3">
          {t("noRecentWords", "No recently created words.")}
        </p>
      )}
    </div>
  );
}
