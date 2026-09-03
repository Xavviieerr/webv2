"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useWordOfDayQuery } from "@/slice/endpoints";

const WordOfTheDay = () => {
  const { t } = useTranslation("common");
  const { data: wordOfDayData, isLoading } = useWordOfDayQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 shadow rounded-md max-w-lg w-full border border-slate-600/20 font-plus-sans text-slate-800 mt-5">
        <p className="text-sm text-slate-500">{t("loading")}…</p>
      </div>
    );
  }

  if (!wordOfDayData) return null;

  return (
    <div className="flex flex-col p-4 shadow rounded-md max-w-lg w-full border border-slate-600/20 font-plus-sans text-slate-800 mt-5">
      <div className="flex items-center max-md:justify-center md:justify-between">
        <div className="flex max-md:flex-col md:gap-4 items-center">
          <p className="text-base font-medium">{t("wordOfTheDay")}</p>
          <p className="text-sm">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Link
          href={`/search/${encodeURIComponent(wordOfDayData.word)}`}
          className="text-sm ml-auto primary-btn py-2 max-md:hidden"
        >
          {t("view")}
        </Link>
      </div>

      <div className="flex flex-col mt-4 max-md:text-center gap-1">
        <div className="flex max-md:flex-col items-center md:gap-4 text-base max-md:justify-center">
          <p className="text-2xl">{wordOfDayData.word}</p>
          <div className="flex items-center gap-4 text-base max-md:justify-center">
            <p className="">/{wordOfDayData.phonetic}/</p>
            <p className="">[{wordOfDayData.ipa}]</p>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-600 line-clamp-1 max-md:hidden">
          {wordOfDayData.meaning}
        </p>

        <Link
          href={`/search/${encodeURIComponent(wordOfDayData.word)}`}
          className="primary-btn py-2 w-full mt-4 md:hidden"
        >
          {t("view")}
        </Link>
      </div>
    </div>
  );
};

export default WordOfTheDay;
