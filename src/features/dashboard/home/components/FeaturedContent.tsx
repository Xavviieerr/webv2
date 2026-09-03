"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWordOfDayQuery } from "@/slice/endpoints";
import { FEATURED_CARD_BG, FEATURED_SECTION_BG } from "../constants/featured";

export function FeaturedContent() {
  const { t } = useTranslation("common");
  const { data: wordOfDayData, isLoading: wordOfDayLoading } = useWordOfDayQuery();

  return (
    <div
      className="w-full rounded-2xl p-5 sm:p-6 lg:p-8 overflow-hidden relative"
      style={{ backgroundColor: FEATURED_SECTION_BG }}
    >
      <h2 className="text-[24px] font-mediu text-white mb-5 sm:mb-6">
        {t("featuredContent")}
      </h2>

      <div
        className="absolute -bottom-6 -right-6 w-full lg:w-[300px] h-[290px] pointer-events-none opacity-80"
        aria-hidden
      >
        <Image
          src="/featured-pie.svg"
          alt=""
          width={285}
          height={290}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div
          className="relative rounded-xl p-5 sm:p-6 flex flex-col min-h-[200px] overflow-hidden"
          style={{ backgroundColor: FEATURED_CARD_BG }}
        >
          <span className="text-[14px] sm:text-sm font-medium text-white/90 uppercase tracking-wide">
            {t("wordOfTheDay")}
          </span>
          {wordOfDayLoading ? (
            <div className="mt-2 flex-1 flex items-center">
              <span className="text-white/70 text-sm">{t("loading")}…</span>
            </div>
          ) : (
            <>
              <h3 className="text-[24px] font-semibold text-white mt-2">
                {wordOfDayData?.word ?? "—"}
              </h3>
              <p className="text-sm text-white/90 font-medium leading-relaxed mt-2 flex-1">
                {wordOfDayData?.meaning ?? ""}
              </p>
            </>
          )}
        </div>

        <div
          className="relative rounded-xl p-5 sm:p-6 flex flex-col min-h-[200px] overflow-hidden"
          style={{ backgroundColor: FEATURED_CARD_BG }}
        >
          <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wide">
            {t("culturalHighlight")}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
            Igbe Ikeneke
          </h3>
          <p className="text-sm text-white/90 leading-relaxed mt-2 flex-1 pr-4 sm:pr-6">
            <span className="block">{t("featuredPhrase2a")}</span>
            <span className="block mt-1">{t("featuredPhrase2b")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
