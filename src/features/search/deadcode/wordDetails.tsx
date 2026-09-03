"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { WordRecord, Meaning } from "@/slice/wordSlice";
import { ArrowLeft, Star, Volume2, ChevronDown } from "lucide-react";

interface WordDetailsProps {
  record: WordRecord;
  relatedWords?: WordRecord[];
  searchCategory?: string;
  onBack?: () => void;
}

export const WordDetails: React.FC<WordDetailsProps> = ({
  record,
  relatedWords = [],
  searchCategory = "Dictionary Word",
  onBack,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeLang, setActiveLang] = useState<"urhobo" | "en" | "kor">(
    "urhobo",
  );

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const handleViewWord = (word: string) => {
    router.push(`/newWordDetails?term=${encodeURIComponent(word)}`);
  };

  const formatDate = () => {
    return "Jan 28 21:28";
  };

  const meanings = record.meanings || [];

  return (
    <div className="min-h-screen bg-white py-16 ">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Go Back</span>
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Search Category:</span>
            <span className="font-bold text-[#D28E3D]">{searchCategory}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* First card: word + ratings + listen (matches image) */}
        <div className="mb-8 rounded-[4px] border border-[#E4E4E4] bg-[#F2FEFF] p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <h1 className="text-3xl sm:text-4xl font-medium text-black shrink-0">
            {record.word}
          </h1>
          <div className="flex flex-col items-start sm:items-end gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2"
            >
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 fill-amber-500 shrink-0" />
              <span>Check Ratings & Reviews</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-[#0288D1] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#0277BD] transition-colors shadow-sm"
            >
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Language switch – each button fills equal width; selected: white bg, dark teal text + underline */}
        <div className="mb-8 flex border-b-2 border-[#2C5F60] bg-[#F8F8F5]">
          {(["urhobo", "en", "kor"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium transition-colors text-center ${
                activeLang === lang
                  ? "bg-white text-[#2C5F60] border-b-4 border-[#2C5F60] -mb-0.5"
                  : "bg-transparent text-[#8B8B8B] border-b-4 border-transparent -mb-0.5 hover:text-gray-600"
              }`}
            >
              {lang === "urhobo"
                ? "Urhobo"
                : lang === "en"
                  ? "English"
                  : "Korean"}
            </button>
          ))}
        </div>

        {/* Sense Cards — horizontal scroll when more than 2 */}
        <div
          className={`mb-12 flex gap-6 pb-2 ${
            meanings.length > 2
              ? "overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2"
              : "flex-wrap"
          }`}
          style={
            meanings.length > 2
              ? { WebkitOverflowScrolling: "touch" }
              : undefined
          }
        >
          {meanings.map((meaning: Meaning, senseIndex: number) => {
            const trans =
              activeLang === "en"
                ? record.translations?.en?.[senseIndex]
                : activeLang === "kor"
                  ? record.translations?.kor?.[senseIndex]
                  : null;
            const transLabel =
              activeLang === "en"
                ? "English"
                : activeLang === "kor"
                  ? "Korean"
                  : "";
            return (
              <div
                key={senseIndex}
                className={`shrink-0 rounded-xl bg-[#F2FEFF] p-6 border border-[#E4E4E4] ${
                  meanings.length > 2
                    ? "w-[85vw] min-w-[280px] sm:w-[320px] sm:min-w-[320px]"
                    : "w-full sm:max-w-[calc(50%-12px)]"
                }`}
              >
                {/* Card header */}
                <div className="mb-4 flex items-baseline justify-between">
                  {/* <span className="text-[20px] font-semibold uppercase tracking-wide text-[#F97316]">
                    SENSE
                  </span> */}
                  <span className="text-2xl font-bold text-[#2C5F60]">
                    {String(senseIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Pronunciation */}
                {(record.pronunciation?.ipa ||
                  record.pronunciation?.phonetic) && (
                  <>
                    <p className="mb-1 text-[20px] font-semibold text-[#05353A]">
                      {t("pronunciation")}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[#2C5F60]/90">
                        [
                        {record.pronunciation?.ipa ||
                          record.pronunciation?.phonetic ||
                          "—"}
                        ]
                      </span>
                      <Volume2 className="h-4 w-4 shrink-0 text-[#2C5F60]" />
                      <button
                        type="button"
                        className="rounded-full bg-[#5BA4A6] px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Listen
                      </button>
                    </div>
                    <div className="my-4 border-b border-gray-200" />
                  </>
                )}

                {/* Image */}
                {meaning.media?.[0]?.url && (
                  <>
                    <p className="mb-2 text-sm font-bold text-[#2C5F60]">
                      Image
                    </p>
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={meaning.media[0].url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="my-4 border-b border-gray-200" />
                  </>
                )}

                {/* Definition — Urhobo then translation directly underneath */}
                {meaning.definitions?.[0] && (
                  <>
                    <p className="mb-1 text-[20px] font-semibold text-[#05353A]">
                      {t("definition")}
                    </p>
                    <p className="text-[#2C5F60]/90">
                      {meaning.definitions[0]}
                    </p>
                    {trans?.definitions?.[0] && (
                      <p className="mt-1.5 text-sm text-[#2C5F60]/80 border-l-2 border-[#2C5F60]/30 pl-3">
                        <span className="font-medium text-[#2C5F60]/90">
                          {transLabel}:
                        </span>{" "}
                        {trans.definitions[0]}
                      </p>
                    )}
                    <div className="my-4 border-b border-gray-200" />
                  </>
                )}

                {/* Part of Speech — Urhobo then translation directly underneath */}
                {meaning.partOfSpeech?.[0] && (
                  <>
                    <p className="mb-1 text-[20px] font-semibold text-[#05353A]">
                      Part of Speech
                    </p>
                    <p className="text-[#2C5F60]/90">
                      {meaning.partOfSpeech[0]}
                    </p>
                    {trans?.partOfSpeech?.[0] && (
                      <p className="mt-1.5 text-sm text-[#2C5F60]/80 border-l-2 border-[#2C5F60]/30 pl-3">
                        <span className="font-medium text-[#2C5F60]/90">
                          {transLabel}:
                        </span>{" "}
                        {trans.partOfSpeech[0]}
                      </p>
                    )}
                    <div className="my-4 border-b border-gray-200" />
                  </>
                )}

                {/* Examples — each Urhobo example with its translation directly underneath */}
                {meaning.examples && meaning.examples.length > 0 && (
                  <>
                    <p className="mb-2 text-[20px] font-semibold text-[#05353A]">
                      {t("Examples")}:
                    </p>
                    <ol className="list-decimal space-y-3 pl-4 text-[#2C5F60]/90">
                      {meaning.examples.map((ex, i) => (
                        <li key={i} className="pl-1">
                          <span>
                            {typeof ex === "string" ? ex : String(ex)}
                          </span>
                          {trans?.examples?.[i] && (
                            <p className="mt-1.5 text-sm text-[#2C5F60]/80 border-l-2 border-[#2C5F60]/30 pl-3">
                              <span className="font-medium text-[#2C5F60]/90">
                                {transLabel}:
                              </span>{" "}
                              {typeof trans.examples[i] === "string"
                                ? trans.examples[i]
                                : String(trans.examples[i])}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                    <div className="my-4 border-b border-gray-200" />
                  </>
                )}

                {/* Plural — Urhobo then translation directly underneath */}
                {meaning.plurals && meaning.plurals.length > 0 && (
                  <>
                    <p className="mb-1 text-[20px] font-semibold text-[#05353A]">
                      {t("plurals")}
                    </p>
                    <ol className="list-decimal space-y-1 pl-4 text-[#2C5F60]/90">
                      {meaning.plurals.map((p, i) => (
                        <li key={i}>{typeof p === "string" ? p : String(p)}</li>
                      ))}
                    </ol>
                    {trans?.plurals && trans.plurals.length > 0 && (
                      <p className="mt-1.5 text-sm text-[#2C5F60]/80 border-l-2 border-[#2C5F60]/30 pl-3">
                        <span className="font-medium text-[#2C5F60]/90">
                          {transLabel}:
                        </span>{" "}
                        {trans.plurals
                          .map((p) => (typeof p === "string" ? p : String(p)))
                          .join(", ")}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Related Words */}
        {relatedWords.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Related Words
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWords.map((related) => (
                <div
                  key={related.id}
                  className="cursor-pointer rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => handleViewWord(related.word)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewWord(related.word);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="bg-[#F0FDFE] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800">
                        {related.word}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Senses - {related.meanings?.length || 0}
                      </span>
                    </div>
                    {(related.pronunciation?.phonetic ||
                      related.pronunciation?.ipa) && (
                      <div className="mt-2">
                        <span className="rounded bg-[#E0F7FA] px-2 py-0.5 text-xs text-[#0288D1]">
                          {t("pronunciation")}
                        </span>
                        <span className="ml-2 text-sm text-gray-700">
                          /
                          {related.pronunciation?.phonetic ||
                            related.pronunciation?.ipa}
                          /
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="mt-2 flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891B2]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewWord(related.word);
                      }}
                    >
                      Show Senses
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F8F8F8] px-4 py-3">
                    <span className="text-xs text-gray-500">
                      Added - {formatDate()}
                    </span>
                    <button
                      type="button"
                      className="text-sm font-medium text-[#06B6D4] underline hover:text-[#0891B2] cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewWord(related.word);
                      }}
                    >
                      View Word
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
