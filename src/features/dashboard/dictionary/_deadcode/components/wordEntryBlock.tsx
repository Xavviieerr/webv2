"use client";

import React, { useEffect, useMemo } from "react";
import { WordRecord } from "@/slice/wordSlice";
import { Volume2 } from "lucide-react";
import PluralSynonymAntonymRelated from "./pluralSynonymAntonymRelated";
import Image from "next/image";

interface WordObject {
  ota?: string;
  egba?: string;
  [key: string]: unknown;
}

export interface WordDisplayEmbeddedProps {
  records: WordRecord[];
  term: string;
}

export interface WordDisplayProps {
  embedded?: WordDisplayEmbeddedProps;
}

type WordEntryItem = {
  record: WordRecord;
  recordIndex: number;
  meaningIndex: number;
  kere: string;
  entryNumber: number;
};

export function WordEntryBlock({
  entry,
  searchTerm,
  activeLang,
  onPlayPronunciation,
  playingAudioUrl,
  t,
}: {
  entry: WordEntryItem;
  /** When user searched in non-Urhobo, this is the search term; headword stays this. */
  searchTerm: string | null;
  activeLang: "urhobo" | "en" | "kor" | null;
  onPlayPronunciation: (url: string | null | undefined) => void;
  playingAudioUrl: string | null;
  t: (key: string) => string;
}) {
  const { record, recordIndex, meaningIndex, entryNumber } = entry;

  const meaning = record.meanings?.[meaningIndex];
  const headword = searchTerm ?? record.word;
  const translationSelected = activeLang !== null;

  const primaryPos = useMemo(() => {
    if (activeLang === "urhobo" || activeLang === null) {
      if (meaning.partOfSpeech && meaning.partOfSpeech.length > 0) {
        return typeof meaning.partOfSpeech[0] === "string"
          ? meaning.partOfSpeech[0].toLowerCase()
          : String(meaning.partOfSpeech[0]);
      }
      return null;
    }

    return record.translations[activeLang]?.[
      meaningIndex
    ]?.partOfSpeech[0].toLowerCase();
  }, [record, activeLang]);

  if (!meaning) return null;

  const trans =
    activeLang === "en"
      ? record.translations?.en?.[meaningIndex]
      : activeLang === "kor"
        ? record.translations?.kor?.[meaningIndex]
        : null;

  const q = (searchTerm ?? "").trim().toLowerCase();

  const isURHSearch = () => {
    const baseWord = (record.word ?? "").trim().toLowerCase();
    return baseWord === q;
  };

  const isENSearch = () => {
    const match = record.translations?.en?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );
    return Boolean(match);
  };

  const isKORSearch = () => {
    const match = record.translations?.kor?.find(
      (tr) => (tr.word ?? "").trim().toLowerCase() === q,
    );
    return Boolean(match);
  };
  const transLabel =
    activeLang === "en" || activeLang === "kor" ? t("translation") : "";

  const translationWord =
    activeLang === "urhobo"
      ? isURHSearch()
        ? ""
        : record.word
      : activeLang === "en" &&
          typeof record.translations?.en?.[meaningIndex]?.word === "string"
        ? isENSearch()
          ? ""
          : record.translations.en[meaningIndex].word
        : activeLang === "kor" &&
            typeof record.translations?.kor?.[meaningIndex]?.word === "string"
          ? isKORSearch()
            ? ""
            : record.translations.kor![meaningIndex].word
          : "";

  const leftLabel = translationSelected && primaryPos ? primaryPos : headword;
  const wordEntryLabel =
    translationSelected && translationWord
      ? `${leftLabel} — ${translationWord}`
      : leftLabel;

  const getAudioUrl = () => {
    if (activeLang == "urhobo" || activeLang == null) {
      return record.pronunciationAudioUrl || "";
    }

    return (
      record.translations?.[activeLang]?.[meaningIndex]
        ?.pronunciationAudioUrl || ""
    );
  };

  const getExamples = () => {
    const urhExamples = record.meanings?.[meaningIndex]?.fullExamples || [];
    if (activeLang == "urhobo" || activeLang == null) {
      return { base: urhExamples, translation: null };
    }

    const translation = record.translations?.[activeLang]?.find(
      (tr) => entry.kere === recordIndex.toString() + tr.kere.toString(),
    );

    const examples = {
      base: urhExamples,
      translation: translation?.fullExamples || [],
    };
    return examples;
  };
  return (
    <div className="mb-8">
      {/* Word entry header: number + word — translation */}
      <div className="flex max-md:flex-col max-md:gap-4 w-full justify-between items-start border-b border-gray-200 pb-6 mb-8">
        <div className="flex flex-col ">
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#05353a] text-white text-sm sm:text-base font-semibold">
              {entryNumber}
            </span>
            <p className="text-2xl sm:text-3xl font-medium text-[#05353a] leading-tight">
              {wordEntryLabel}
            </p>
          </div>
          {(() => {
            // For this entry block, pronunciation follows the selected translation:
            // - Urhobo / no selection → base word pronunciation
            // - English / Korean → that translation's pronunciation when available
            const basePron = record.pronunciation;
            const enPron =
              record.translations?.en?.[meaningIndex]?.pronunciation;
            const korPron =
              record.translations?.kor?.[meaningIndex]?.pronunciation;
            const entryPron =
              activeLang === "en"
                ? (enPron ?? basePron)
                : activeLang === "kor"
                  ? (korPron ?? basePron)
                  : basePron;

            if (!entryPron || (!entryPron.phonetic && !entryPron.ipa))
              return null;

            const audioUrl = getAudioUrl();

            // const canPlayAudio =
            //   record.pronunciationAudioUrl &&
            //   (activeLang === "urhobo" || activeLang === null);

            return (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {entryPron.phonetic && (
                  <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#05353a20] text-[#333333] text-sm sm:text-base font-sans">
                    {entryPron.phonetic}
                  </span>
                )}
                {entryPron.ipa && (
                  <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#7A989A] text-white text-sm sm:text-base font-sans">
                    {entryPron.ipa}
                  </span>
                )}
                {audioUrl && (
                  <button
                    type="button"
                    onClick={() => onPlayPronunciation(audioUrl)}
                    disabled={playingAudioUrl != null}
                    className="ml-1 flex items-center justify-center p-1.5 rounded-lg bg-[#0E808D] text-white hover:bg-[#0a6b77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                    aria-label="Listen to pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {entry.record.meanings[meaningIndex].media.length > 0 && (
          <Image
            src={entry.record.meanings[meaningIndex].media[0].url}
            alt={entry.record?.word || "Word image"}
            width={300}
            height={300}
            className="rounded-lg object-cover w-24 h-24 lg:w-32 lg:h-32"
            unoptimized
          />
        )}
      </div>

      <div className="mb-10">
        {/* Part of speech + translation word */}

        <div className="lg:mt-2 w-full">
          {/* Definitions */}
          {meaning?.definitions?.length ? (
            <div className="mt-5 w-full border-b border-gray-200 pb-12 lg:max-w-[825px]">
              <h3 className="font-semibold text-[#05353A] mb-2 ">
                {t("definition")}
              </h3>
              {meaning.definitions.map((definition, defIndex) => {
                const definitionText =
                  typeof definition === "string"
                    ? definition
                    : String(definition);
                const translationDef = trans?.definitions?.[defIndex];
                const translationDefText =
                  translationDef != null
                    ? typeof translationDef === "string"
                      ? translationDef
                      : String(translationDef)
                    : null;
                return (
                  <div key={defIndex} className="mb-2 ">
                    <p className="text-gray-700 ml-4 text-lg font-medium">
                      {definitionText}
                    </p>
                    {translationSelected &&
                      translationDefText &&
                      transLabel && (
                        <p className="text-[16px] text-[#05353a80] border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                          <span className="font-medium text-[#0E808D]">
                            {transLabel}:
                          </span>{" "}
                          {translationDefText}
                        </p>
                      )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {(() => {
            const { base, translation } = getExamples();

            return (
              <div className="mt-5 w-full">
                <h3 className="font-semibold text-[#05353A]">
                  {t("examples")}
                </h3>
                <div>
                  {base.map((item, index) => {
                    return (
                      <div key={index} className="mb-2 mt-5">
                        <div className="flex items-start gap-2">
                          <p className="text-gray-700 font-medium flex-1">
                            {index + 1}. {item.sentence}
                          </p>
                          {item.audioUrl && (
                            <button
                              type="button"
                              onClick={() => onPlayPronunciation(item.audioUrl)}
                              disabled={playingAudioUrl != null}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E808D] text-white text-xs font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                              aria-label={t("listen")}
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>{t("listen")}</span>
                            </button>
                          )}
                        </div>

                        {translation &&
                          translation.length > 0 &&
                          translation.length > index && (
                            <div
                              onClick={() => {
                                if (playingAudioUrl != null) return;
                                if (translation[index].audioUrl)
                                  onPlayPronunciation(
                                    translation[index].audioUrl,
                                  );
                              }}
                              className="flex mt-1.5 w-fit items-center gap-4 cursor-pointer"
                            >
                              <p className=" text-[16px] text-[#05353a80] border-l-2 border-[#0E808D]/30 pl-3">
                                <span className="font-medium text-[#0E808D]">
                                  {transLabel}:
                                </span>{" "}
                                {translation[index].sentence}
                              </p>
                              {translation[index].audioUrl && (
                                <Volume2
                                  size={16}
                                  className=" text-gray-500 mt-0.5"
                                />
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Examples */}
          {/* {meaning?.examples?.length ? (
            <div className="mt-5 w-full">
              <h3 className="font-semibold text-[#05353A]">{t("examples")}</h3>
              <div>
                {meaning.examples.map((example, exIndex) => {
                  const exampleText =
                    typeof example === "string" ? example : String(example);
                  const translationEx = trans?.examples?.[exIndex];
                  const translationExText =
                    translationEx != null
                      ? typeof translationEx === "string"
                        ? translationEx
                        : String(translationEx)
                      : null;
                  const exampleAudioUrl =
                    meaning.exampleAudioUrls?.[exIndex] ?? null;
                  return (
                    <div key={exIndex} className="mb-2 mt-5">
                      <div className="flex items-start gap-2">
                        <p className="text-gray-700 font-medium flex-1">
                          {exIndex + 1}. {exampleText}
                        </p>
                        {exampleAudioUrl && (
                          <button
                            type="button"
                            onClick={() => onPlayPronunciation(exampleAudioUrl)}
                            disabled={playingAudioUrl != null}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E808D] text-white text-xs font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                            aria-label={t("listen")}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{t("listen")}</span>
                          </button>
                        )}
                      </div>
                      {translationSelected &&
                        translationExText &&
                        transLabel && (
                          <p className="mt-1.5 text-[16px] text-[#05353a80] border-l-2 border-[#0E808D]/30 pl-3">
                            <span className="font-medium text-[#0E808D]">
                              {transLabel}:
                            </span>{" "}
                            {translationExText}
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null} */}

          <PluralSynonymAntonymRelated meaning={meaning} />

          {/* Plurals, Synonyms, and Antonyms Box */}
          {/* {((meaning?.plurals && meaning.plurals.length > 0) ||
            (meaning?.synonyms && meaning.synonyms.length > 0) ||
            (meaning?.antonyms && meaning.antonyms.length > 0)) && (
            <div className=" w-full lg:max-w-[825px] border-t border-gray-200 pt-8 mt-4">
              {meaning?.plurals && meaning.plurals.length > 0 && (
                <div className="mb-4 last:mb-0">
                  <div className="bg-[#05353a30] rounded-lg border border-gray-200 p-4 min-h-[80px]">
                    <h3 className="font-semibold text-[#05353A] mb-3 text-lg">
                      {t("plurals")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {meaning.plurals.map((plural, pluralIndex) => {
                        const pluralText =
                          typeof plural === "string"
                            ? plural
                            : (plural as WordObject)?.ota || String(plural);
                        return (
                          <span key={pluralIndex}>
                            <span className="text-[#05353A] font-semibold">
                              {pluralText}
                            </span>
                            {pluralIndex <
                              (meaning.plurals?.length || 0) - 1 && (
                              <span className="text-gray-400">,</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {meaning?.synonyms && meaning.synonyms.length > 0 && (
                <div className="mb-4 last:mb-0">
                  <div className="bg-[#05353a30] rounded-lg border border-gray-200 p-4 min-h-[80px]">
                    <h3 className="font-semibold text-[#05353A] mb-3 text-lg">
                      {t("synonyms")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {meaning.synonyms.map((syn, synIndex) => {
                        const synWord =
                          typeof syn === "string"
                            ? syn
                            : syn?.word
                              ? typeof syn.word === "string"
                                ? syn.word
                                : (syn.word as WordObject)?.ota ||
                                  String(syn.word)
                              : String(syn);
                        return (
                          <span key={synIndex}>
                            <span className="text-[#05353A] font-semibold">
                              {synWord}
                            </span>
                            {synIndex < (meaning.synonyms?.length || 0) - 1 && (
                              <span className="text-gray-400">,</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {meaning?.antonyms && meaning.antonyms.length > 0 && (
                <div className="mb-4 last:mb-0">
                  <div className="bg-[#05353a30] rounded-lg border border-gray-200 p-4 min-h-[80px]">
                    <h3 className="font-semibold text-[#05353A] mb-3 text-lg">
                      {t("antonyms")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {meaning.antonyms.map((antonym, antonymIndex) => {
                        const antonymText =
                          typeof antonym === "string"
                            ? antonym
                            : (antonym as WordObject)?.ota || String(antonym);
                        return (
                          <span key={antonymIndex}>
                            <span className="text-[#05353A] font-semibold">
                              {antonymText}
                            </span>
                            {antonymIndex <
                              (meaning.antonyms?.length || 0) - 1 && (
                              <span className="text-gray-400">,</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
