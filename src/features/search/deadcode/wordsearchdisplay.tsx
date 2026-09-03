"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setSearchQuery,
  setSearchResults,
  WordRecord,
} from "@/slice/wordSlice";
import { setPlayingAudio } from "@/slice/audioSlice";
import {
  useLazyGetWordDetailsQuery,
  useLazyAutocompleteQuery,
  useLazySearchWordsQuery,
} from "@/slice/endpoints";
import { transformSearchResponse } from "@/utils/transformSearchResponse";
import { RiLoader2Fill } from "react-icons/ri";
import { useAppSelector } from "@/types/hooks";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import ComingSoonModal from "@/components/ComingSoonModal";
import ProfileModal from "@/components/ProfileModal";
import UsernameModal from "@/components/UsernameModal";
import PasswordModal from "@/components/PasswordModal";
import DeleteAccountModal from "@/components/DeleteModal";
import { WordEntryBlock } from "./wordEntryBlock";
import Link from "next/link";

export interface WordDisplayEmbeddedProps {
  records: WordRecord[];
  term: string;
}

export interface WordDisplayProps {
  embedded?: WordDisplayEmbeddedProps;
}

const WordDisplay = ({ embedded }: WordDisplayProps = {}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams() || "";
  const termFromUrl = searchParams?.get("term");
  const term = embedded ? embedded.term : (termFromUrl ?? null);
  const token = useSelector((state: RootState) => state.auth)?.token;
  const user = useSelector((state: RootState) => state.auth.user);
  const { detailedWord, isLoading, error, searchQuery } = useSelector(
    (state: RootState) => state.word,
  );
  const playingAudioUrl = useSelector(
    (state: RootState) => state.audio?.playingAudioUrl ?? null,
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const language = useAppSelector(
    (state: RootState) => state.language.language,
  );
  const { t } = useTranslation("common");
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [partialSearchResults, setPartialSearchResults] = useState<
    WordRecord[]
  >([]);
  /** Local language for translation; null = user has not selected yet (for non-Urhobo search). */
  const [activeLang, setActiveLang] = useState<"urhobo" | "en" | "kor" | null>(
    "urhobo",
  );
  const [userChangedLang, setUserChangedLang] = useState(false);
  const [getWordDetailsTrigger] = useLazyGetWordDetailsQuery();
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const [searchWordsTrigger] = useLazySearchWordsQuery();

  const handleCloseModal = () => {
    setActiveModal(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        dispatch(setSearchQuery(""));
        dispatch(setSearchResults([]));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!embedded && term && token) {
      getWordDetailsTrigger({ term: term as string, language })
        .unwrap()
        .catch((err: { status?: number }) => {
          if (err?.status === 401) setShowComingSoonModal(true);
        });
    }
  }, [embedded, term, token, language, getWordDetailsTrigger]);

  // Fetch partial search results when there's an exact match (skip when embedded)
  useEffect(() => {
    if (embedded) {
      setPartialSearchResults([]);
      return;
    }
    const fetchPartialResults = async () => {
      const isAuthenticated = user || (token && token !== "public");
      const currentRecords = detailedWord?.records || [];

      if (
        term &&
        token &&
        isAuthenticated &&
        !detailedWord?.metadata?.isPartialSearch &&
        currentRecords.length > 0
      ) {
        try {
          const response = await searchWordsTrigger({
            q: term as string,
            mode: "partial",
          }).unwrap();
          const data = response as { data?: { results?: unknown[] } };
          const transformed = transformSearchResponse(
            data,
            language || "urhobo",
          );
          const filteredResults = transformed.records.filter(
            (record: WordRecord) =>
              record.word.toLowerCase() !== (term as string).toLowerCase(),
          );
          setPartialSearchResults(filteredResults as WordRecord[]);
        } catch {
          setPartialSearchResults([]);
        }
      } else {
        setPartialSearchResults([]);
      }
    };

    fetchPartialResults();
  }, [embedded, term, token, detailedWord, user, language, searchWordsTrigger]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        dispatch(setSearchResults([]));
        return;
      }
      try {
        const result = await fetchAutocomplete({ q: searchQuery }).unwrap();
        if (result && typeof result === "object" && "requiresAuth" in result) {
          setShowComingSoonModal(true);
          dispatch(setSearchResults([]));
          return;
        }
        if (Array.isArray(result)) {
          dispatch(
            setSearchResults(
              result.map((item, index) => ({
                ...item,
                id: typeof item.id === "number" ? item.id : index,
              })),
            ),
          );
        } else {
          dispatch(setSearchResults([]));
        }
      } catch {
        dispatch(setSearchResults([]));
      }
    };

    fetchSuggestions();
  }, [searchQuery, dispatch, fetchAutocomplete]);

  const records = React.useMemo(
    () => (embedded ? embedded.records : detailedWord?.records || []),
    [embedded, detailedWord],
  );

  /**
   * Flatten records into word entries: one entry per (record, sense/oho).
   * Numbering increases across all entries so multi-sense words get multiple numbers.
   */
  const wordEntries = React.useMemo(() => {
    const entries: {
      record: WordRecord;
      recordIndex: number;
      meaningIndex: number;
      kere: string;
      entryNumber: number;
    }[] = [];
    let n = 1;
    const searchedTerm = (embedded?.term ?? term ?? "n/a")
      ?.trim()
      .toLowerCase();

    const recordMatch = records.filter((r) => {
      if (r.word.trim().toLowerCase() === searchedTerm) return true;
      if (
        r.translations?.en?.some(
          (t) => t.word.trim().toLowerCase() === searchedTerm,
        )
      )
        return true;
      if (
        r.translations?.kor?.some(
          (t) => t.word.trim().toLowerCase() === searchedTerm,
        )
      )
        return true;
    });

    if (recordMatch.length) {
      recordMatch.forEach((record, recordIndex) => {
        record.meanings?.forEach((meaning, meaningIndex) => {
          entries.push({
            record,
            recordIndex,
            meaningIndex,
            kere: recordIndex.toString() + meaning.kere.toString(),
            entryNumber: n++,
          });
        });
      });
    }
    return entries;
  }, [records]);

  // When first showing results, default translation is always Urhobo
  // unless the user has already manually changed the language.

  useEffect(() => {
    if (!records || records.length === 0 || userChangedLang) return;
    if (language !== "urhobo" && language !== "en" && language !== "kor") {
      return setActiveLang("urhobo");
    }
    setActiveLang((prev) => {
      return language;
    });
  }, [records, userChangedLang, language]);

  if (!embedded && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <RiLoader2Fill className="animate-spin text-3xl text-[#05353A]" />
      </div>
    );
  }

  if (!embedded && error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  /**
   * Headword is always the search term.
   * Pronunciation should follow that headword:
   * - If the headword is Urhobo (matches record.word), use record.pronunciation.
   * - If the headword is an English or Korean translation, use that translation's pronunciation when available.
   * - Otherwise fall back to record.pronunciation.
   *
   */

  const getHeadPronunciation = () => {
    const q = (embedded?.term ?? term ?? "").trim().toLowerCase();
    const recordMatch = records.find((r) => {
      if (r.word.toLowerCase() === q) return true;
      if (r.translations?.en?.some((t) => t.word.toLowerCase() === q))
        return true;
      if (r.translations?.kor?.some((t) => t.word.toLowerCase() === q))
        return true;
    });

    if (!q) return records[0].pronunciation;
    if (!recordMatch) return records[0].pronunciation;

    const baseWord = (recordMatch.word ?? "").trim().toLowerCase();
    if (baseWord === q) {
      return recordMatch.pronunciation;
    }

    const enMatch = recordMatch.translations?.en?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );

    if (enMatch?.pronunciation) {
      return enMatch.pronunciation;
    }

    const korMatch = recordMatch.translations?.kor?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );
    if (korMatch?.pronunciation) {
      return korMatch.pronunciation;
    }
  };

  const getHeadwordPronunciation = (record: WordRecord) => {
    const q = (embedded?.term ?? term ?? "").trim().toLowerCase();
    if (!q) return record.pronunciation;

    const baseWord = (record.word ?? "").trim().toLowerCase();
    if (baseWord === q) {
      return record.pronunciation;
    }

    const enMatch = record.translations?.en?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );

    if (enMatch?.pronunciation) {
      return enMatch.pronunciation;
    }

    const korMatch = record.translations?.kor?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );
    if (korMatch?.pronunciation) {
      return korMatch.pronunciation;
    }

    return record.pronunciation;
  };

  return (
    <div className="min-h-screen bg-[#f2feff] w-full">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:px-10 lg:pl-24 px-4">
        <div className="flex-1 w-full ">
          <div className="rounded-lg mb-6 z-0">
            {/* term header - Only show for exact matches, not partial results (always show when embedded) */}
            {(embedded || !detailedWord?.metadata?.isPartialSearch) && (
              <div className=" mt-5">
                <div className="flex items-start max-w-[825px] justify-between gap-4 ">
                  <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-8 lg:pb-12 flex-1 lg:mt-6 max-w-[825px] justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Word + Dialect */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <p className="text-2xl sm:text-3xl font-medium text-[#05353a] leading-tight">
                          {/* {records[0].word} */}
                          {term}
                        </p>
                        {records.length > 0 &&
                          (() => {
                            const primaryDialect =
                              records[0].meanings?.[0]?.dialect;
                            const isStandard =
                              primaryDialect === "Agbarho" ||
                              primaryDialect === "Agbọ";
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
                                  <span className="opacity-90">
                                    · {primaryDialect}
                                  </span>
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

                      {/* Pronunciation: always use headword (Urhobo) pronunciation, independent of translation selection */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {records.length > 0 &&
                          (() => {
                            const pronunciation = getHeadPronunciation();
                            return pronunciation?.ipa ? (
                              // pronunciation?.phonetic ||
                              <>
                                {/* {pronunciation?.phonetic && (
                                  <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#E6EEED] text-[#333333] text-sm sm:text-base font-sans">
                                    /{pronunciation.phonetic}/
                                  </span>
                                )} */}
                                {pronunciation?.ipa && (
                                  <span className="rounded-full italic px-3 py-1.5 sm:px-4 bg-[#7A989A] text-white text-sm sm:text-base font-sans">
                                    /{pronunciation.ipa}/
                                  </span>
                                )}
                              </>
                            ) : null;
                          })()}
                      </div>
                      {/* Translation: on mobile stays here; on desktop shown under image */}
                      <div className="mt-3 flex items-center gap-2 lg:hidden">
                        {/* <span className="hidden sm:inline text-xs sm:text-sm font-sans text-black whitespace-nowrap">
                          Translation:
                        </span> */}
                        {/* <span className="sr-only">Translation</span> */}
                        <Select
                          value={activeLang ?? ""}
                          onValueChange={(v) => {
                            if (
                              v &&
                              (v === "urhobo" || v === "en" || v === "kor")
                            ) {
                              setUserChangedLang(true);
                              setActiveLang(v);
                            }
                          }}
                        >
                          <SelectTrigger
                            aria-label="Translation language"
                            className="min-w-[120px] border-gray-300 bg-[#E6F3F4] text-xs sm:text-sm font-medium text-black focus:ring-2 focus:ring-[#05353a] focus:ring-offset-0"
                          >
                            <SelectValue placeholder="Select translation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urhobo">Urhobo</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="kor">Korean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Partial Search Results Card - Below IPA/Phonetics row */}
                      {partialSearchResults.length > 0 && (
                        <div className="mt-5 max-w-3xl">
                          <div className="bg-[#05353a30] rounded-lg border border-gray-200 p-4 min-h-[80px]">
                            <div className="flex flex-wrap items-center gap-2">
                              {partialSearchResults.map(
                                (record: WordRecord, index: number) => {
                                  const firstTranslation =
                                    record.translations?.en?.[0]?.word || "";
                                  const displayText = firstTranslation
                                    ? `${record.word} `
                                    : record.word;
                                  return (
                                    <span key={index}>
                                      <button
                                        onClick={() => {
                                          router.push(
                                            `/newWordDetails?term=${encodeURIComponent(record.word)}`,
                                          );
                                        }}
                                        className="text-[#05353A] hover:text-[#065a63] hover:underline font-semibold transition-colors"
                                      >
                                        {displayText}
                                      </button>
                                      {index <
                                        partialSearchResults.length - 1 && (
                                        <span className="text-gray-400">,</span>
                                      )}
                                    </span>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Word Image - Display from first meaning's media; on desktop Translation under image */}
                    {/* {records.length > 0 &&
                      records[0].meanings?.[0]?.media?.[0]?.url && (
                        <div className="flex flex-col gap-3"> */}
                    {/* Translation above image on desktop only */}
                    <div className="hidden lg:flex flex-col gap-2">
                      <Select
                        value={activeLang ?? ""}
                        onValueChange={(v) => {
                          if (
                            v &&
                            (v === "urhobo" || v === "en" || v === "kor")
                          ) {
                            setUserChangedLang(true);
                            setActiveLang(v);
                          }
                        }}
                      >
                        <SelectTrigger
                          aria-label="Translation language"
                          className="min-w-[120px] border-gray-300 bg-[#E6F3F4] text-xs sm:text-sm font-medium text-black focus:ring-2 focus:ring-[#05353a] focus:ring-offset-0"
                        >
                          <SelectValue placeholder="Select translation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urhobo">Urhobo</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="kor">Korean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* <Image
                            src={records[0].meanings[0].media[0].url}
                            alt={records[0]?.word || term || "Word image"}
                            width={300}
                            height={300}
                            className="rounded-lg object-cover lg:w-42 lg:h-52 w-full h-auto"
                            unoptimized
                          /> */}
                    {/* </div> */}
                    {/* )} */}
                    {/* When no image: Translation on desktop in right area */}
                    {/* {!records[0]?.meanings?.[0]?.media?.[0]?.url && (
                      <div className="hidden lg:flex flex-col gap-2"> */}
                    {/* <span className="text-xs sm:text-sm font-sans text-black whitespace-nowrap">
                          Translation:
                        </span> */}
                    {/* <Select
                          value={activeLang ?? ""}
                          onValueChange={(v) => {
                            if (
                              v &&
                              (v === "urhobo" || v === "en" || v === "kor")
                            ) {
                              setUserChangedLang(true);
                              setActiveLang(v);
                            }
                          }}
                        >
                          <SelectTrigger
                            aria-label="Translation language"
                            className="min-w-[120px] border-gray-300 bg-[#E6F3F4] text-xs sm:text-sm font-medium text-black focus:ring-2 focus:ring-[#05353a] focus:ring-offset-0"
                          >
                            <SelectValue placeholder="Select translation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urhobo">Urhobo</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="kor">Korean</SelectItem>
                          </SelectContent>
                        </Select> */}
                    {/* </div> */}
                    {/* )} */}
                  </div>
                </div>
              </div>
            )}

            <div className="px-2 py-6">
              {/* Show "word not found" message when records is empty (no partial search results) */}
              {records.length === 0 &&
                term &&
                !embedded &&
                !detailedWord?.metadata?.isPartialSearch && (
                  <div className="lg:pl-12 my-5">
                    <p className="text-2xl font-bold text-[#05353a] capitalize">
                      {term} {t("notFound") || "not found"}
                    </p>
                  </div>
                )}

              {/* Show "word not found" message and partial results in a single box */}
              {!embedded &&
                detailedWord?.metadata?.isPartialSearch &&
                records.length > 0 && (
                  <div className="lg:pl-12 my-5">
                    <div className="bg-[#05353a30] rounded-lg border border-gray-200 p-4 max-w-3xl">
                      <p className="text-lg font-medium text-[#05353a] mb-3">
                        {t("wordNotFound") || "Do you mean:"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 ">
                        {records.map((record: WordRecord, index: number) => {
                          const firstTranslation =
                            record.translations?.en?.[0]?.word || "";
                          const displayText = firstTranslation
                            ? `${record.word} `
                            : record.word;
                          return (
                            <span key={index}>
                              <button
                                onClick={() => {
                                  router.push(
                                    `/newWordDetails?term=${encodeURIComponent(record.word)}`,
                                  );
                                }}
                                className="text-[#05353A] hover:text-[#065a63] hover:underline font-semibold transition-colors"
                              >
                                {displayText}
                              </button>
                              {index < records.length - 1 && (
                                <span className="text-gray-400">,</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              {/* Word entries: one numbered block per (record, sense) */}
              {embedded || !detailedWord?.metadata?.isPartialSearch
                ? wordEntries.map((entry, index) => (
                    <WordEntryBlock
                      key={`${entry.record.id}-${entry.meaningIndex}-${entry.entryNumber}`}
                      entry={{ ...entry, entryNumber: index + 1 }}
                      searchTerm={embedded?.term ?? term ?? null}
                      activeLang={activeLang}
                      onPlayPronunciation={handlePlayPronunciation}
                      playingAudioUrl={playingAudioUrl ?? null}
                      t={t}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>

      {showComingSoonModal && (
        <ComingSoonModal closeModal={() => setShowComingSoonModal(false)} />
      )}
      {/* Profile Modals - Rendered at page level to avoid z-index issues */}
      {activeModal === "personalDetails" && (
        <ProfileModal closeModal={handleCloseModal} />
      )}
      {activeModal === "username" && (
        <UsernameModal closeModal={handleCloseModal} />
      )}
      {activeModal === "password" && (
        <PasswordModal closeModal={handleCloseModal} />
      )}
      {activeModal === "delete" && (
        <DeleteAccountModal closeModal={handleCloseModal} />
      )}
    </div>
  );
};

export default WordDisplay;
