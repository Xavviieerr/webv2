"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setPlayingAudio } from "@/slice/audioSlice";
import { ChevronLeft, Volume2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyGetWordDetailsQuery } from "@/slice/wordEndpoints";
import { WordRecord, setSearchQuery } from "@/slice/wordSlice";
import { GenericSearchComponent } from "@/features/dashboard/dictionary/components/genericSearchComponent";
import {
  ThankYouForReviewModal,
  RatingsAndReviewsPanel,
  LeaveReviewForm,
} from "./ratingModals";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DictonaryWordDetailsEmbeddedProps {
  records: WordRecord[];
  term: string;
  reverse?: boolean;
}

export interface DictonaryWordDetailsProps {
  /** When set, use this data instead of fetching from API (e.g. when rendered inside search results). */
  embedded?: DictonaryWordDetailsEmbeddedProps;
  /** When true (e.g. in embedded mode), hide the top Go Back / Ratings bar. */
  hideTopBar?: boolean;
}

export const DictonaryWordDetails = ({
  embedded,
  hideTopBar = false,
}: DictonaryWordDetailsProps = {}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const termFromUrl = searchParams.get("term") || "";
  const reverseFromUrl = searchParams.get("reverse") === "true";
  const term = (embedded ? embedded.term : termFromUrl).trim();
  const reverse = embedded ? (embedded.reverse ?? true) : reverseFromUrl;
  const playingAudioUrl = useSelector(
    (state: RootState) => state.audio?.playingAudioUrl ?? null,
  );
  const [activeLang, setActiveLang] = useState<"urhobo" | "en" | "kor">(
    "urhobo",
  );
  const [showWordExplanation, setShowWordExplanation] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [fetchWordDetails, { data: fetchedData, isLoading }] =
    useLazyGetWordDetailsQuery();
  const [hasTriedReverseFallback, setHasTriedReverseFallback] = useState(false);

  const data = embedded ? { records: embedded.records } : fetchedData;

  // Keep the Redux search query in sync so GenericSearchComponent shows the current term
  useEffect(() => {
    if (!embedded) {
      dispatch(setSearchQuery(term ?? ""));
    }
  }, [embedded, term, dispatch]);

  useEffect(() => {
    if (!embedded && term) {
      fetchWordDetails({ term, language: "urhobo", reverse });
    }
  }, [embedded, term, reverse, fetchWordDetails]);

  // If we searched by English/Korean (reverse=false) and got no records, try a reverse=true
  // lookup before declaring "word not found", so we can render the Urhobo entry when it exists.
  useEffect(() => {
    if (embedded || !term || isLoading || hasTriedReverseFallback) return;
    if (reverse) return; // already reverse lookup

    const records =
      (fetchedData as { records?: WordRecord[] } | undefined)?.records ?? [];
    if (records.length === 0) {
      setHasTriedReverseFallback(true);
      fetchWordDetails({ term, language: "urhobo", reverse: true });
    }
  }, [
    embedded,
    term,
    reverse,
    isLoading,
    fetchedData,
    hasTriedReverseFallback,
    fetchWordDetails,
  ]);

  // Reset fallback flag when term or embedded mode changes
  useEffect(() => {
    setHasTriedReverseFallback(false);
  }, [term, embedded]);

  const handleGoBack = () => {
    router.back();
  };

  const handleViewWord = (word: string, useReverse?: boolean) => {
    const params = new URLSearchParams();
    params.set("term", word);
    if (useReverse ?? reverse) params.set("reverse", "true");
    router.push(`/dashboard/dictionary/word-details?${params.toString()}`);
  };

  const handlePlayPronunciation = (audioUrl: string | null | undefined) => {
    if (!audioUrl) return;
    dispatch(setPlayingAudio(audioUrl));
    const audio = new Audio(audioUrl);
    const clearPlaying = () => dispatch(setPlayingAudio(null));
    audio.addEventListener("ended", clearPlaying);
    audio.addEventListener("error", clearPlaying);
    audio.play().catch(clearPlaying);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jan 28 2023";
    try {
      const date = new Date(dateString);
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day} ${year}`;
    } catch {
      return "Jan 28 2023";
    }
  };

  if (!embedded && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const allRecords: WordRecord[] = data?.records || [];
  const termLower = term.trim().toLowerCase();

  // Prefer exact Urhobo (ota) match; if none, fall back to matches in translations
  let primaryIndex = allRecords.findIndex((r) => {
    const word = (r.word || "").trim().toLowerCase();
    return word === termLower;
  });

  if (primaryIndex === -1) {
    primaryIndex = allRecords.findIndex((r) => {
      const enMatches = r.translations?.en?.some(
        (t) => t.word?.trim().toLowerCase() === termLower,
      );
      const korMatches = r.translations?.kor?.some(
        (t) => t.word?.trim().toLowerCase() === termLower,
      );
      return !!enMatches || !!korMatches;
    });
  }

  const record: WordRecord | null =
    primaryIndex >= 0
      ? allRecords[primaryIndex]
      : allRecords.length > 0
        ? allRecords[0]
        : null;

  // If there are no records at all, show "word not found" (only when not embedded).
  // IMPORTANT: when searching English/Korean first (reverse=false), we trigger a reverse=true
  // fallback. During that transition, avoid flashing the not-found view by only rendering it
  // once we've either already tried the reverse fallback or are already in reverse mode.
  if (
    !embedded &&
    allRecords.length === 0 &&
    (reverse || hasTriedReverseFallback)
  ) {
    return (
      <WordNotFoundView
        term={term}
        onGoBack={handleGoBack}
        onSearch={(newTerm) => {
          const params = new URLSearchParams();
          params.set("term", newTerm);
          if (reverse) params.set("reverse", "true");
          router.push(
            `/dashboard/dictionary/word-details?${params.toString()}`,
          );
        }}
      />
    );
  }

  // Related words: everything except the primary record (if any); exclude the searched term
  let relatedWords: WordRecord[] =
    primaryIndex >= 0
      ? allRecords.filter((_, idx) => idx !== primaryIndex)
      : allRecords;
  relatedWords = relatedWords.filter((r) => r.word.toLowerCase() !== termLower);

  // Get wordId from the original API response (fallback to record.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalWordData = (data as any)?.data?.results?.[0]?.word;
  const wordId = record ? originalWordData?.id || record.id || "" : "";

  // Always use Urhobo meanings as the base, translations will be shown underneath
  const currentMeanings = record ? record.meanings || [] : [];
  const primaryRecord = record as WordRecord;

  /** Headword and pronunciation for the active translation language */
  const getDisplayForLang = (
    rec: WordRecord,
    lang: "urhobo" | "en" | "kor",
  ) => {
    const headword =
      lang === "urhobo"
        ? rec.word
        : lang === "en"
          ? (rec.translations?.en?.[0]?.word ?? rec.word)
          : (rec.translations?.kor?.[0]?.word ?? rec.word);
    const pronunciation =
      lang === "urhobo"
        ? rec.pronunciation
        : lang === "en"
          ? rec.translations?.en?.[0]?.pronunciation
          : rec.translations?.kor?.[0]?.pronunciation;
    return { headword, pronunciation };
  };

  const displayForLang = primaryRecord
    ? getDisplayForLang(primaryRecord, activeLang)
    : null;

  return (
    <div className="min-h-screen py-6 sm:py-8 w-full max-w-full overflow-x-hidden">
      {/* Word Explanation Tooltip */}
      {showWordExplanation && primaryRecord?.creationReason && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowWordExplanation(false)}
        >
          <div
            className="bg-[#F5F5DC] rounded-xl p-5 max-w-md w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-[#02474F] flex items-center justify-center bg-[#02474F] shrink-0">
                  <span className="text-[10px] font-bold text-white">i</span>
                </div>
                <h3 className="text-base font-bold text-[#02474F]">
                  Word Explanation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWordExplanation(false)}
                className="text-[#02474F] hover:text-[#0E808D] transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <p className="text-[#02474F] text-sm leading-relaxed">
              {primaryRecord?.creationReason}
            </p>
          </div>
        </div>
      )}

      {/* Go Back Button - hidden when embedded (e.g. in search results) */}
      {!hideTopBar && (
        <div className="w-full items-center mx-auto flex justify-between mb-4 sm:mb-6 px-4 sm:px-6">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Go Back</span>
          </button>
        </div>
      )}

      {/* Top search bar for quick lookups (page mode only) */}
      {!embedded && (
        <div className="w-full max-w-4xl mx-auto mb-6 px-4 sm:px-6">
          <GenericSearchComponent
            onSearchOnly={(newTerm) => {
              if (!newTerm?.trim()) return;
              handleViewWord(newTerm.trim(), reverse);
            }}
          />
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section: Word Card */}
        <div className="mb-8 bg-white rounded-md p-4 sm:p-6 border border-[#E4E4E4]">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            {/* Left: Word + Checkmark + Phonetic */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black wrap-break-word">
                  {displayForLang?.headword ??
                    primaryRecord?.word ??
                    term ??
                    ""}
                </h1>
                {(() => {
                  const primaryDialect = primaryRecord?.meanings?.[0]?.dialect;
                  const isStandard = primaryDialect === "Agbarho";
                  if (primaryDialect && !isStandard) {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#02474F] text-[#02474F] bg-transparent text-sm font-medium">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 1.5625C12.3206 1.5625 14.5462 2.48437 16.1872 4.12532C17.8281 5.76626 18.75 7.99186 18.75 10.3125C18.75 12.6331 17.8281 14.8587 16.1872 16.4997C14.5462 18.1406 12.3206 19.0625 10 19.0625C7.67936 19.0625 5.45376 18.1406 3.81282 16.4997C2.17187 14.8587 1.25 12.6331 1.25 10.3125C1.25 7.99186 2.17187 5.76626 3.81282 4.12532C5.45376 2.48437 7.67936 1.5625 10 1.5625ZM11.3125 6.93359C11.9629 6.93359 12.4902 6.48438 12.4902 5.81445C12.4902 5.14453 11.9629 4.69531 11.3125 4.69531C10.6621 4.69531 10.1367 5.14453 10.1367 5.81445C10.1367 6.48438 10.6641 6.93555 11.3125 6.93555M11.541 13.9688C11.541 13.8359 11.5879 13.4883 11.5605 13.2891L10.5332 14.4727C10.3203 14.6953 10.0547 14.8516 9.92969 14.8105C9.87328 14.7895 9.82621 14.749 9.79687 14.6964C9.76753 14.6438 9.75784 14.5825 9.76953 14.5234L11.4805 9.11328C11.6211 8.42578 11.2363 7.80078 10.4199 7.7207C9.56055 7.7207 8.29102 8.59375 7.51953 9.70312C7.51953 9.83594 7.49414 10.1641 7.51953 10.3633L8.54688 9.17969C8.76172 8.95703 9.00781 8.80078 9.13281 8.84375C9.19363 8.8667 9.24333 8.9121 9.27168 8.9706C9.30002 9.02911 9.30484 9.09625 9.28516 9.1582L7.58594 14.543C7.39062 15.1719 7.76172 15.7891 8.66211 15.9297C9.98828 15.9297 10.7715 15.0781 11.543 13.9688H11.541Z"
                            fill="#02474F"
                          />
                        </svg>
                        {primaryDialect && (
                          <span className="opacity-90">· {primaryDialect}</span>
                        )}
                      </span>
                    );
                  }
                  if (isStandard) {
                    return (
                      <div className="relative group inline-flex">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M28.2325 12.8525C27.7612 12.36 27.2738 11.8525 27.09 11.4062C26.92 10.9975 26.91 10.32 26.9 9.66375C26.8813 8.44375 26.8612 7.06125 25.9 6.1C24.9387 5.13875 23.5562 5.11875 22.3363 5.1C21.68 5.09 21.0025 5.08 20.5938 4.91C20.1488 4.72625 19.64 4.23875 19.1475 3.7675C18.285 2.93875 17.305 2 16 2C14.695 2 13.7162 2.93875 12.8525 3.7675C12.36 4.23875 11.8525 4.72625 11.4062 4.91C11 5.08 10.32 5.09 9.66375 5.1C8.44375 5.11875 7.06125 5.13875 6.1 6.1C5.13875 7.06125 5.125 8.44375 5.1 9.66375C5.09 10.32 5.08 10.9975 4.91 11.4062C4.72625 11.8512 4.23875 12.36 3.7675 12.8525C2.93875 13.715 2 14.695 2 16C2 17.305 2.93875 18.2837 3.7675 19.1475C4.23875 19.64 4.72625 20.1475 4.91 20.5938C5.08 21.0025 5.09 21.68 5.1 22.3363C5.11875 23.5562 5.13875 24.9387 6.1 25.9C7.06125 26.8612 8.44375 26.8813 9.66375 26.9C10.32 26.91 10.9975 26.92 11.4062 27.09C11.8512 27.2738 12.36 27.7612 12.8525 28.2325C13.715 29.0613 14.695 30 16 30C17.305 30 18.2837 29.0613 19.1475 28.2325C19.64 27.7612 20.1475 27.2738 20.5938 27.09C21.0025 26.92 21.68 26.91 22.3363 26.9C23.5562 26.8813 24.9387 26.8612 25.9 25.9C26.8612 24.9387 26.8813 23.5562 26.9 22.3363C26.91 21.68 26.92 21.0025 27.09 20.5938C27.2738 20.1488 27.7612 19.64 28.2325 19.1475C29.0613 18.285 30 17.305 30 16C30 14.695 29.0613 13.7162 28.2325 12.8525ZM21.7075 13.7075L14.7075 20.7075C14.6146 20.8005 14.5043 20.8742 14.3829 20.9246C14.2615 20.9749 14.1314 21.0008 14 21.0008C13.8686 21.0008 13.7385 20.9749 13.6171 20.9246C13.4957 20.8742 13.3854 20.8005 13.2925 20.7075L10.2925 17.7075C10.1996 17.6146 10.1259 17.5043 10.0756 17.3829C10.0253 17.2615 9.99944 17.1314 9.99944 17C9.99944 16.8686 10.0253 16.7385 10.0756 16.6171C10.1259 16.4957 10.1996 16.3854 10.2925 16.2925C10.4801 16.1049 10.7346 15.9994 11 15.9994C11.1314 15.9994 11.2615 16.0253 11.3829 16.0756C11.5043 16.1259 11.6146 16.1996 11.7075 16.2925L14 18.5863L20.2925 12.2925C20.3854 12.1996 20.4957 12.1259 20.6171 12.0756C20.7385 12.0253 20.8686 11.9994 21 11.9994C21.1314 11.9994 21.2615 12.0253 21.3829 12.0756C21.5043 12.1259 21.6146 12.1996 21.7075 12.2925C21.8004 12.3854 21.8741 12.4957 21.9244 12.6171C21.9747 12.7385 22.0006 12.8686 22.0006 13C22.0006 13.1314 21.9747 13.2615 21.9244 13.3829C21.8741 13.5043 21.8004 13.6146 21.7075 13.7075Z"
                            fill="#02474F"
                          />
                        </svg>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-10 whitespace-nowrap">
                          Dialect: {primaryDialect}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              {displayForLang?.pronunciation &&
                (displayForLang.pronunciation.ipa ||
                  displayForLang.pronunciation.phonetic) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {displayForLang.pronunciation.ipa && (
                      <span className="rounded-full px-3 py-1.5 italic sm:px-4 bg-[#7A989A] text-white text-sm sm:text-base font-sans">
                        /{displayForLang.pronunciation.ipa}/
                      </span>
                    )}
                  </div>
                )}
            </div>

            {/* Right: Word Explanation + Translation */}
            <div className="flex flex-col lg:flex-col items-start lg:items-end gap-3 shrink-0">
              {primaryRecord?.otaOkpopko && primaryRecord?.creationReason && (
                <button
                  type="button"
                  onClick={() => setShowWordExplanation(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer bg-[#F5DEB3] hover:bg-[#F5C97A] text-[#02474F] transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125ZM10.1813 5.95898C10.7666 5.95898 11.2412 5.55469 11.2412 4.95176C11.2412 4.34883 10.7666 3.94453 10.1813 3.94453C9.5959 3.94453 9.12305 4.34883 9.12305 4.95176C9.12305 5.55469 9.59766 5.96074 10.1813 5.96074M10.3869 12.2906C10.3869 12.1711 10.4291 11.8582 10.4045 11.6789L9.47988 12.7441C9.28828 12.9445 9.04922 13.0852 8.93672 13.0482C8.88595 13.0293 8.84359 12.9929 8.81718 12.9455C8.79078 12.8982 8.78206 12.843 8.79258 12.7898L10.3324 7.9207C10.459 7.30195 10.1127 6.73945 9.37793 6.66738C8.60449 6.66738 7.46191 7.45312 6.76758 8.45156C6.76758 8.57109 6.74473 8.86641 6.76758 9.0457L7.69219 7.98047C7.88555 7.78008 8.10703 7.63945 8.21953 7.67812C8.27427 7.69878 8.319 7.73964 8.34451 7.79229C8.37002 7.84494 8.37436 7.90538 8.35664 7.96113L6.82734 12.8074C6.65156 13.3734 6.98555 13.9289 7.7959 14.0555C8.98945 14.0555 9.69434 13.2891 10.3887 12.2906H10.3869Z"
                      fill="#02474F"
                    />
                  </svg>
                  <span className="underline text-[#02474F]">
                    Word Explanation
                  </span>
                </button>
              )}
              <div className="flex items-center gap-2">
                {/* <span className="text-xs sm:text-sm font-sans text-black whitespace-nowrap">Translation:</span> */}
                <Select
                  value={activeLang}
                  onValueChange={(v) =>
                    setActiveLang(v as "urhobo" | "en" | "kor")
                  }
                >
                  <SelectTrigger className="min-w-[100px] border-gray-300 bg-[#E6F3F4] text-xs sm:text-sm font-medium text-black focus:ring-2 focus:ring-[#02474F] focus:ring-offset-0">
                    <SelectValue placeholder="Translation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urhobo">Urhobo</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="kor">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout: stack sections without their own scroll areas */}
        <div className="block lg:hidden mb-8 space-y-6">
          {/* Mobile: Word senses */}
          {currentMeanings.length > 0 && (
            <div className="flex flex-col gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {currentMeanings.map((meaning: any, index: number) => {
                const senseNumber = String(index + 1).padStart(2, "0");
                // Get translation for this sense
                const trans =
                  activeLang === "en"
                    ? primaryRecord?.translations?.en?.[index]
                    : activeLang === "kor"
                      ? primaryRecord?.translations?.kor?.[index]
                      : null;
                const transLabel =
                  activeLang === "en"
                    ? "English"
                    : activeLang === "kor"
                      ? "Korean"
                      : "";

                // Word for this sense in the active translation language
                const senseWord =
                  trans?.word ??
                  primaryRecord?.translations?.en?.[index]?.word ??
                  "";

                return (
                  <div
                    key={index}
                    className="w-full bg-white rounded-xl p-6 border border-gray-100"
                  >
                    {/* Sense Number + word in active language */}
                    <div className="text-[32px] font-medium text-[#05353A] mb-2">
                      {senseNumber}
                      {senseWord && (
                        <>
                          <span className="text-[#05353A]/80 font-normal">
                            {" "}
                            —{" "}
                          </span>
                          <span className="text-[22px] sm:text-[26px] font-normal text-[#4A4A4A]">
                            {senseWord}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Phonetic + IPA pills + Listen Button (by active translation) */}
                    {displayForLang?.pronunciation &&
                      (displayForLang.pronunciation.phonetic ||
                        displayForLang.pronunciation.ipa) && (
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                          <div className="flex flex-wrap items-center gap-2">
                            {displayForLang.pronunciation.phonetic && (
                              <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#E6EEED] text-[#333333] text-sm sm:text-base font-sans">
                                {displayForLang.pronunciation.phonetic}
                              </span>
                            )}
                          </div>
                          {primaryRecord?.pronunciationAudioUrl &&
                            activeLang === "urhobo" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePlayPronunciation(
                                    primaryRecord?.pronunciationAudioUrl,
                                  )
                                }
                                disabled={playingAudioUrl != null}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E808D] text-white text-sm font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                                aria-label="Listen to pronunciation"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>Listen</span>
                              </button>
                            )}
                        </div>
                      )}

                    {/* Definition */}
                    {meaning.definitions?.[0] && (
                      <div className="mb-6">
                        <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                          Definition
                        </h3>
                        <p className="text-[#05353A] leading-relaxed mb-2">
                          {(() => {
                            const def = meaning.definitions[0];
                            if (typeof def === "string") return def;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const defObj = def as any;
                            return defObj?.ota || defObj?.egba || String(def);
                          })()}
                        </p>
                        {trans?.definitions?.[0] && (
                          <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                            <span className="font-medium text-[#0E808D]">
                              {transLabel}:
                            </span>{" "}
                            {(() => {
                              const def = trans.definitions[0];
                              if (typeof def === "string") return def;
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const defObj = def as any;
                              return defObj?.ota || defObj?.egba || String(def);
                            })()}
                          </p>
                        )}
                        <div className="mt-4 border-b border-gray-200" />
                      </div>
                    )}

                    {/* Part of Speech */}
                    {meaning.partOfSpeech &&
                      meaning.partOfSpeech.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                            Part of Speech
                          </h3>
                          <p className="text-[#05353A] mb-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {meaning.partOfSpeech
                              .map((pos: any) => {
                                if (typeof pos === "string") return pos;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const posObj = pos as any;
                                return (
                                  posObj?.ota || posObj?.egba || String(pos)
                                );
                              })
                              .join(", ")}
                          </p>
                          {trans?.partOfSpeech?.[0] && (
                            <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                              <span className="font-medium text-[#0E808D]">
                                {transLabel}:
                              </span>{" "}
                              {(() => {
                                const pos = trans.partOfSpeech[0];
                                if (typeof pos === "string") return pos;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const posObj = pos as any;
                                return (
                                  posObj?.ota || posObj?.egba || String(pos)
                                );
                              })()}
                            </p>
                          )}
                          <div className="mt-4 border-b border-gray-200" />
                        </div>
                      )}

                    {/* Image */}
                    {meaning.media && meaning.media.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                          Image
                        </h3>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={meaning.media[0].url}
                            alt={
                              displayForLang?.headword ??
                              primaryRecord?.word ??
                              term ??
                              ""
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-4 border-b border-gray-200" />
                      </div>
                    )}

                    {/* Examples */}
                    {meaning.examples && meaning.examples.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-medium text-[#05353A] mb-3 text-[22px]">
                          Example:
                        </h3>
                        <ol className="list-decimal list-inside space-y-3">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {meaning.examples.map((example: any, idx: number) => {
                            const exampleText =
                              typeof example === "string"
                                ? example
                                : example.sentence ||
                                  example.ota ||
                                  String(example);
                            const exampleAudioUrl =
                              meaning.exampleAudioUrls?.[idx] ?? null;
                            return (
                              <li key={idx} className="text-[#05353A]">
                                <div className="flex items-start gap-2">
                                  <span className="flex-1">{exampleText}</span>
                                  {exampleAudioUrl && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePlayPronunciation(exampleAudioUrl)
                                      }
                                      disabled={playingAudioUrl != null}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E808D] text-white text-xs font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                                      aria-label="Listen to pronunciation"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                      <span>Listen</span>
                                    </button>
                                  )}
                                </div>
                                {trans?.examples?.[idx] && (
                                  <p className="mt-1.5 text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3">
                                    <span className="font-medium text-[#0E808D]">
                                      {transLabel}:
                                    </span>{" "}
                                    {typeof trans.examples[idx] === "string"
                                      ? trans.examples[idx]
                                      : String(trans.examples[idx])}
                                  </p>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                        <div className="mt-4 border-b border-gray-200" />
                      </div>
                    )}

                    {/* Plural */}
                    {meaning.plurals && meaning.plurals.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                          Plural
                        </h3>
                        <ol className="list-decimal list-inside space-y-1">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {meaning.plurals.map((plural: any, idx: number) => (
                            <li key={idx} className="text-[#05353A]">
                              {typeof plural === "string"
                                ? plural
                                : plural.word || plural.ota || String(plural)}
                            </li>
                          ))}
                        </ol>
                        {trans?.plurals && trans.plurals.length > 0 && (
                          <p className="mt-1.5 text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3">
                            <span className="font-medium text-[#0E808D]">
                              {transLabel}:
                            </span>{" "}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {trans.plurals
                              .map((p: any) =>
                                typeof p === "string" ? p : String(p),
                              )
                              .join(", ")}
                          </p>
                        )}
                        <div className="mt-4 border-b border-gray-200" />
                      </div>
                    )}

                    {/* Antonyms and Synonyms - Two Columns */}
                    {(meaning.antonyms?.length > 0 ||
                      meaning.synonyms?.length > 0) && (
                      <div className="grid grid-cols-1 gap-4">
                        {/* Antonyms */}
                        {meaning.antonyms && meaning.antonyms.length > 0 && (
                          <>
                            <h3 className="font-medium text-[#0E808D] mb-2 text-[22px]">
                              Antonyms
                            </h3>
                            <ul className="space-y-1">
                              {meaning.antonyms.map(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (antonym: any, idx: number) => (
                                  <li key={idx} className="text-[#4A4A4A]">
                                    {typeof antonym === "string"
                                      ? antonym
                                      : antonym.word ||
                                        antonym.ota ||
                                        String(antonym)}
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        )}

                        {/* Synonyms */}
                        {meaning.synonyms && meaning.synonyms.length > 0 && (
                          <div>
                            <h3 className="font-medium text-[#0E808D] mb-2 text-[22px]">
                              Synonyms
                            </h3>
                            <ul className="space-y-1">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {meaning.synonyms.map(
                                (synonym: any, idx: number) => (
                                  <li key={idx} className="text-[#4A4A4A]">
                                    {typeof synonym === "string"
                                      ? synonym
                                      : synonym.word}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile: Ratings & Reviews stacked below meanings */}
          <div className="w-full bg-white rounded-xl p-4 border border-gray-100">
            {wordId ? (
              <>
                <RatingsAndReviewsPanel wordId={wordId} />
                <LeaveReviewForm
                  wordId={wordId}
                  onSubmitSuccess={() => setShowThankYouModal(true)}
                />
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Ratings and reviews load with word details.
              </p>
            )}
          </div>
        </div>

        {/* Desktop: two columns with their own scroll areas */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-8 min-h-0 lg:min-h-[90vh]">
          {/* Left column: Word senses - individual vertical scroll */}
          <ScrollArea className="h-[90vh] min-h-[400px] w-full rounded-lg overflow-hidden">
            <div className="pb-8">
              {currentMeanings.length > 0 && (
                <div className="flex flex-col gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {currentMeanings.map((meaning: any, index: number) => {
                    const senseNumber = String(index + 1).padStart(2, "0");
                    // Get translation for this sense
                    const trans =
                      activeLang === "en"
                        ? primaryRecord?.translations?.en?.[index]
                        : activeLang === "kor"
                          ? primaryRecord?.translations?.kor?.[index]
                          : null;
                    const transLabel =
                      activeLang === "en"
                        ? "English"
                        : activeLang === "kor"
                          ? "Korean"
                          : "";

                    // Word for this sense in the active translation language
                    const senseWord =
                      trans?.word ??
                      primaryRecord?.translations?.en?.[index]?.word ??
                      "";

                    return (
                      <div
                        key={index}
                        className="w-full bg-white rounded-xl p-6 border border-gray-100"
                      >
                        {/* Sense Number + word in active language */}
                        <div className="text-[32px] font-medium text-[#05353A] mb-2">
                          {senseNumber}
                          {senseWord && (
                            <>
                              <span className="text-[#05353A]/80 font-normal">
                                {" "}
                                —{" "}
                              </span>
                              <span className="text-[22px] sm:text-[26px] font-normal text-[#4A4A4A]">
                                {senseWord}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Phonetic + IPA pills + Listen Button (by active translation) */}
                        {displayForLang?.pronunciation &&
                          (displayForLang.pronunciation.phonetic ||
                            displayForLang.pronunciation.ipa) && (
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                              <div className="flex flex-wrap items-center gap-2">
                                {displayForLang.pronunciation.phonetic && (
                                  <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#E6EEED] text-[#333333] text-sm sm:text-base font-sans">
                                    {displayForLang.pronunciation.phonetic}
                                  </span>
                                )}
                              </div>
                              {primaryRecord?.pronunciationAudioUrl &&
                                activeLang === "urhobo" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePlayPronunciation(
                                        primaryRecord?.pronunciationAudioUrl,
                                      )
                                    }
                                    disabled={playingAudioUrl != null}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E808D] text-white text-sm font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                                    aria-label="Listen to pronunciation"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                    <span>Listen</span>
                                  </button>
                                )}
                            </div>
                          )}

                        {/* Definition */}
                        {meaning.definitions?.[0] && (
                          <div className="mb-6">
                            <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                              Definition
                            </h3>
                            <p className="text-[#05353A] leading-relaxed mb-2">
                              {(() => {
                                const def = meaning.definitions[0];
                                if (typeof def === "string") return def;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const defObj = def as any;
                                return (
                                  defObj?.ota || defObj?.egba || String(def)
                                );
                              })()}
                            </p>
                            {trans?.definitions?.[0] && (
                              <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                                <span className="font-medium text-[#0E808D]">
                                  {transLabel}:
                                </span>{" "}
                                {(() => {
                                  const def = trans.definitions[0];
                                  if (typeof def === "string") return def;
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  const defObj = def as any;
                                  return (
                                    defObj?.ota || defObj?.egba || String(def)
                                  );
                                })()}
                              </p>
                            )}
                            <div className="mt-4 border-b border-gray-200" />
                          </div>
                        )}

                        {/* Part of Speech */}
                        {meaning.partOfSpeech &&
                          meaning.partOfSpeech.length > 0 && (
                            <div className="mb-6">
                              <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                                Part of Speech
                              </h3>
                              <p className="text-[#05353A] mb-2">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {meaning.partOfSpeech
                                  .map((pos: any) => {
                                    if (typeof pos === "string") return pos;
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const posObj = pos as any;
                                    return (
                                      posObj?.ota || posObj?.egba || String(pos)
                                    );
                                  })
                                  .join(", ")}
                              </p>
                              {trans?.partOfSpeech?.[0] && (
                                <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                                  <span className="font-medium text-[#0E808D]">
                                    {transLabel}:
                                  </span>{" "}
                                  {(() => {
                                    const pos = trans.partOfSpeech[0];
                                    if (typeof pos === "string") return pos;
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const posObj = pos as any;
                                    return (
                                      posObj?.ota || posObj?.egba || String(pos)
                                    );
                                  })()}
                                </p>
                              )}
                              <div className="mt-4 border-b border-gray-200" />
                            </div>
                          )}

                        {/* Image */}
                        {meaning.media && meaning.media.length > 0 && (
                          <div className="mb-6">
                            <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                              Image
                            </h3>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={meaning.media[0].url}
                                alt={
                                  displayForLang?.headword ??
                                  primaryRecord?.word ??
                                  term ??
                                  ""
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="mt-4 border-b border-gray-200" />
                          </div>
                        )}

                        {/* Examples */}
                        {meaning.examples && meaning.examples.length > 0 && (
                          <div className="mb-6">
                            <h3 className="font-medium text-[#05353A] mb-3 text-[22px]">
                              Example:
                            </h3>
                            <ol className="list-decimal list-inside space-y-3">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {meaning.examples.map(
                                (example: any, idx: number) => {
                                  const exampleText =
                                    typeof example === "string"
                                      ? example
                                      : example.sentence ||
                                        example.ota ||
                                        String(example);
                                  const exampleAudioUrl =
                                    meaning.exampleAudioUrls?.[idx] ?? null;
                                  return (
                                    <li key={idx} className="text-[#05353A]">
                                      <div className="flex items-start gap-2">
                                        <span className="flex-1">
                                          {exampleText}
                                        </span>
                                        {exampleAudioUrl && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handlePlayPronunciation(
                                                exampleAudioUrl,
                                              )
                                            }
                                            disabled={playingAudioUrl != null}
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E808D] text-white text-xs font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                                            aria-label="Listen to pronunciation"
                                          >
                                            <Volume2 className="w-3 h-3" />
                                            <span>Listen</span>
                                          </button>
                                        )}
                                      </div>
                                      {trans?.examples?.[idx] && (
                                        <p className="mt-1.5 text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3">
                                          <span className="font-medium text-[#0E808D]">
                                            {transLabel}:
                                          </span>{" "}
                                          {typeof trans.examples[idx] ===
                                          "string"
                                            ? trans.examples[idx]
                                            : String(trans.examples[idx])}
                                        </p>
                                      )}
                                    </li>
                                  );
                                },
                              )}
                            </ol>
                            <div className="mt-4 border-b border-gray-200" />
                          </div>
                        )}

                        {/* Plural */}
                        {meaning.plurals && meaning.plurals.length > 0 && (
                          <div className="mb-6">
                            <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
                              Plural
                            </h3>
                            <ol className="list-decimal list-inside space-y-1">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {meaning.plurals.map(
                                (plural: any, idx: number) => (
                                  <li key={idx} className="text-[#05353A]">
                                    {typeof plural === "string"
                                      ? plural
                                      : plural.word ||
                                        plural.ota ||
                                        String(plural)}
                                  </li>
                                ),
                              )}
                            </ol>
                            {trans?.plurals && trans.plurals.length > 0 && (
                              <p className="mt-1.5 text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3">
                                <span className="font-medium text-[#0E808D]">
                                  {transLabel}:
                                </span>{" "}
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {trans.plurals
                                  .map((p: any) =>
                                    typeof p === "string" ? p : String(p),
                                  )
                                  .join(", ")}
                              </p>
                            )}
                            <div className="mt-4 border-b border-gray-200" />
                          </div>
                        )}

                        {/* Antonyms and Synonyms - Two Columns */}
                        {(meaning.antonyms?.length > 0 ||
                          meaning.synonyms?.length > 0) && (
                          <div className="grid grid-cols-1 gap-4">
                            {/* Antonyms */}
                            {meaning.antonyms &&
                              meaning.antonyms.length > 0 && (
                                <>
                                  <h3 className="font-medium text-[#0E808D] mb-2 text-[22px]">
                                    Antonyms
                                  </h3>
                                  <ul className="space-y-1">
                                    {meaning.antonyms.map(
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      (antonym: any, idx: number) => (
                                        <li
                                          key={idx}
                                          className="text-[#4A4A4A]"
                                        >
                                          {typeof antonym === "string"
                                            ? antonym
                                            : antonym.word ||
                                              antonym.ota ||
                                              String(antonym)}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </>
                              )}

                            {/* Synonyms */}
                            {meaning.synonyms &&
                              meaning.synonyms.length > 0 && (
                                <div>
                                  <h3 className="font-medium text-[#0E808D] mb-2 text-[22px]">
                                    Synonyms
                                  </h3>
                                  <ul className="space-y-1">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {meaning.synonyms.map(
                                      (synonym: any, idx: number) => (
                                        <li
                                          key={idx}
                                          className="text-[#4A4A4A]"
                                        >
                                          {typeof synonym === "string"
                                            ? synonym
                                            : synonym.word}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Right column: Ratings & Review - individual vertical scroll */}
          <ScrollArea className="h-[90vh] min-h-[400px] w-full rounded-lg overflow-hidden">
            <div className="pb-8">
              {wordId ? (
                <>
                  <RatingsAndReviewsPanel wordId={wordId} />
                  <LeaveReviewForm
                    wordId={wordId}
                    onSubmitSuccess={() => setShowThankYouModal(true)}
                  />
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Ratings and reviews load with word details.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Related Words Section */}
        {relatedWords.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[22px] font-medium text-[#0E808D] mb-6">
              Related Words
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {relatedWords.map((relatedWord: WordRecord) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const originalWordData = (data as any)?.records?.find(
                  (r: WordRecord) => r.word === relatedWord.word,
                );
                const createdAt = originalWordData?.createdAt;

                return (
                  <div
                    key={relatedWord.id}
                    className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[200px]"
                  >
                    {/* Top Row: Word + Senses Count */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-[22px] font-medium text-[#0E808D] flex-1 min-w-0">
                        {relatedWord.word}
                      </h3>
                    </div>

                    {/* Pronunciation pills + Audio Icon */}
                    {(relatedWord.pronunciation?.phonetic ||
                      relatedWord.pronunciation?.ipa) && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {relatedWord.pronunciation?.phonetic && (
                          <span className="rounded-full px-3 py-1.5 bg-[#E6EEED] text-[#333333] text-sm font-sans">
                            {relatedWord.pronunciation.phonetic}
                          </span>
                        )}
                        {relatedWord.pronunciation?.ipa && (
                          <span className="rounded-full px-3 py-1.5 bg-[#7A989A] text-white text-sm font-sans">
                            {relatedWord.pronunciation.ipa}
                          </span>
                        )}
                        {relatedWord?.pronunciationAudioUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayPronunciation(
                                relatedWord?.pronunciationAudioUrl,
                              )
                            }
                            disabled={playingAudioUrl != null}
                            className="p-1 rounded-full hover:bg-[#0E808D]/10 text-[#4A4A4A]/80 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            aria-label="Listen to pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200/50 my-3"></div>

                    {/* Footer: Date + View Word */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Added - {formatDate(createdAt)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleViewWord(relatedWord.word, reverse)
                        }
                        className="px-4 py-2 rounded-lg bg-[#0a6b77] hover:bg-[#0E808D] cursor-pointer text-white text-sm font-medium transition-colors"
                      >
                        View Word
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ThankYouForReviewModal
        open={showThankYouModal}
        onOpenChange={setShowThankYouModal}
        onContinue={() => {
          // Continue browsing - modal will close
        }}
      />
    </div>
  );
};

export interface WordNotFoundViewProps {
  term: string;
  onGoBack: () => void;
  onSearch: (newTerm: string) => void;
}

export const WordNotFoundView = ({
  term,
  onGoBack,
  onSearch,
}: WordNotFoundViewProps) => {
  const dispatch = useDispatch();

  // Sync current term to Redux so GenericSearchComponent shows it in the input
  useEffect(() => {
    dispatch(setSearchQuery(term ?? ""));
  }, [term, dispatch]);

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className=" mx-auto px-4 sm:px-6">
        {/* Go Back */}
        <button
          type="button"
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        {/* Search — GenericSearchComponent (suggestions, history built-in) */}
        <div className="mb-6 w-full max-w-[928px] mx-auto min-w-0 px-4 sm:px-0">
          <GenericSearchComponent onSearchOnly={onSearch} />
        </div>

        {/* Search Results label */}
        <h2 className="text-[24px] font-medium text-gray-900 mb-8">
          Search Results for &quot;{term || "..."}&quot;
        </h2>

        {/* Centered No Word Found block */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-[320px] aspect-4/3 mb-6">
            <Image
              src="/word-not-found.svg"
              alt="No word found"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            No word Found
          </h3>
          <p className="text-base text-gray-700">
            This word isn&apos;t in the dictionary yet.
          </p>
        </div>
      </div>
    </div>
  );
};
