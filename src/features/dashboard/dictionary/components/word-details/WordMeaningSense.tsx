"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resolveLocalizedText } from "../../utils/localizedText";
import type { Meaning, Translation, WordRecord } from "@/types/word";

export interface WordMeaningSenseLabels {
  definition: string;
  partOfSpeech: string;
  imageLabel: string;
  exampleLabel: string;
  plurals: string;
  antonyms: string;
  synonyms: string;
}

export interface WordPronunciation {
  ipa?: string;
  phonetic?: string;
}

interface WordMeaningSenseProps {
  meaning: Meaning;
  senseNumber: string;
  senseWord: string;
  transLabel: string;
  activeLang: "urhobo" | "en" | "kor";
  imageAlt: string;
  trans: Translation | null | undefined;
  primaryRecord: WordRecord;
  pronunciation: WordPronunciation | undefined;
  playingAudioUrl: string | null;
  labels: WordMeaningSenseLabels;
  onPlayPronunciation: (url: string) => void;
}

/**
 * A single word-sense card shared by the mobile and desktop layouts of
 * WordDetailsPage. Label text is passed in because the mobile tree is
 * i18n-driven while the desktop tree currently uses hardcoded English.
 */
export function WordMeaningSense({
  meaning,
  senseNumber,
  senseWord,
  transLabel,
  activeLang,
  imageAlt,
  trans,
  primaryRecord,
  pronunciation,
  playingAudioUrl,
  labels,
  onPlayPronunciation,
}: WordMeaningSenseProps) {
  const { t } = useTranslation("common");

  return (
    <div className="w-full bg-[#D4E8EA] rounded-xl p-6 border border-[#9EC9CC]">
      {/* Sense Number + word in active language */}
      <div className="text-[32px] font-medium text-[#05353A] mb-2">
        {senseNumber}
        {senseWord && (
          <>
            <span className="text-[#05353A]/80 font-normal"> — </span>
            <span className="text-[22px] sm:text-[26px] font-normal text-[#4A4A4A]">
              {senseWord}
            </span>
          </>
        )}
      </div>

      {/* Phonetic + IPA pills + Listen Button (by active translation) */}
      {pronunciation &&
        (pronunciation.phonetic || pronunciation.ipa) && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {pronunciation.phonetic && (
                <span className="rounded-full px-3 py-1.5 sm:px-4 bg-[#E6EEED] text-[#333333] text-sm sm:text-base font-sans">
                  {pronunciation.phonetic}
                </span>
              )}
            </div>
            {primaryRecord?.pronunciationAudioUrl &&
              activeLang === "urhobo" && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayPronunciation(
                      primaryRecord.pronunciationAudioUrl as string,
                    )
                  }
                  disabled={playingAudioUrl != null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E808D] text-white text-sm font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                  aria-label="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t("listen")}</span>
                </button>
              )}
          </div>
        )}

      {/* Definition */}
      {meaning.definitions?.[0] && (
        <div className="mb-6">
          <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
            {labels.definition}
          </h3>
          <p className="text-[#05353A] leading-relaxed mb-2">
            {resolveLocalizedText(meaning.definitions[0])}
          </p>
          {trans?.definitions?.[0] && (
            <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
              <span className="font-medium text-[#0E808D]">
                {transLabel}:
              </span>{" "}
              {resolveLocalizedText(trans.definitions[0])}
            </p>
          )}
          <div className="mt-4 border-b border-[#9EC9CC]/50" />
        </div>
      )}

      {/* Part of Speech */}
      {meaning.partOfSpeech &&
        meaning.partOfSpeech.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
              {labels.partOfSpeech}
            </h3>
            <p className="text-[#05353A] mb-2">
              {meaning.partOfSpeech.map(resolveLocalizedText).join(", ")}
            </p>
            {trans?.partOfSpeech?.[0] && (
              <p className="text-[16px] text-[#05353A]/80 border-l-2 border-[#0E808D]/30 pl-3 mt-1.5">
                <span className="font-medium text-[#0E808D]">
                  {transLabel}:
                </span>{" "}
                {resolveLocalizedText(trans.partOfSpeech[0])}
              </p>
            )}
            <div className="mt-4 border-b border-[#9EC9CC]/50" />
          </div>
        )}

      {/* Image */}
      {meaning.media && meaning.media.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
            {labels.imageLabel}
          </h3>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={meaning.media[0].url}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 border-b border-[#9EC9CC]/50" />
        </div>
      )}

      {/* Examples */}
      {meaning.examples && meaning.examples.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-[#05353A] mb-3 text-[22px]">
            {labels.exampleLabel}
          </h3>
          <ol className="list-decimal list-inside space-y-3">
            { }
            {meaning.examples.map((example: any, idx: number) => {
              const exampleText =
                typeof example === "string"
                  ? example
                  : example.sentence ||
                    example.ota ||
                    String(example);
              const exampleAudioUrl = meaning.exampleAudioUrls?.[idx] ?? null;
              return (
                <li key={idx} className="text-[#05353A]">
                  <div className="flex items-start gap-2">
                    <span className="flex-1">{exampleText}</span>
                    {exampleAudioUrl && (
                      <button
                        type="button"
                        onClick={() => onPlayPronunciation(exampleAudioUrl)}
                        disabled={playingAudioUrl != null}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E808D] text-white text-xs font-medium hover:bg-[#0a6b77] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E808D]"
                        aria-label="Listen to pronunciation"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{t("listen")}</span>
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
          <div className="mt-4 border-b border-[#9EC9CC]/50" />
        </div>
      )}

      {/* Plural */}
      {meaning.plurals && meaning.plurals.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-[#05353A] mb-2 text-[22px]">
            {labels.plurals}
          </h3>
          <ol className="list-decimal list-inside space-y-1">
            { }
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
              { }
              {trans.plurals
                .map((p: any) => (typeof p === "string" ? p : String(p)))
                .join(", ")}
            </p>
          )}
          <div className="mt-4 border-b border-[#9EC9CC]/50" />
        </div>
      )}

      {/* Antonyms and Synonyms - Two Columns */}
      {((meaning.antonyms?.length ?? 0) > 0 ||
        (meaning.synonyms?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 gap-4">
          {/* Antonyms */}
          {meaning.antonyms && meaning.antonyms.length > 0 && (
            <>
              <h3 className="font-medium text-[#0E808D] mb-2 text-[22px]">
                {labels.antonyms}
              </h3>
              <ul className="space-y-1">
                {meaning.antonyms.map(
                   
                  (antonym: any, idx: number) => (
                    <li key={idx} className="text-[#4A4A4A]">
                      {typeof antonym === "string"
                        ? antonym
                        : antonym.word || antonym.ota || String(antonym)}
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
                {labels.synonyms}
              </h3>
              <ul className="space-y-1">
                { }
                {meaning.synonyms.map((synonym: any, idx: number) => (
                  <li key={idx} className="text-[#4A4A4A]">
                    {typeof synonym === "string" ? synonym : synonym.word}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}