"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconVolume2 } from "@tabler/icons-react";
import { useWordOfDayQuery } from "@/slice/endpoints";
import { usePronunciationAudio } from "@/features/dashboard/dictionary/hooks/usePronunciationAudio";

export function WordOfDayCard() {
  const { t } = useTranslation("common");
  const { data, isLoading } = useWordOfDayQuery();
  const { playingAudioUrl, handlePlayPronunciation } = usePronunciationAudio();

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl overflow-hidden bg-[#02474F] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5DEB3]">
          {t("wordOfTheDay", "Word of the Day")}
        </span>
        <span className="text-[10px] text-[#F5DEB3]/60">{dateStr}</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-7 w-3/4 rounded animate-pulse bg-[#F5DEB3]/20" />
          <div className="h-3 w-full rounded animate-pulse bg-[#F5DEB3]/15" />
          <div className="h-3 w-2/3 rounded animate-pulse bg-[#F5DEB3]/15" />
        </div>
      ) : data ? (
        <div>
          <h3 className="text-2xl font-bold text-white leading-tight">
            {data.word}
          </h3>
          {data.phonetic && (
            <span className="text-xs text-[#F5DEB3]/60 mt-1 inline-block">
              /{data.phonetic}/
            </span>
          )}
          <p className="text-xs text-white/80 mt-2 line-clamp-2 leading-relaxed">
            {data.meaning}
          </p>
          <div className="flex items-center gap-2 mt-3">
            {data.audioUrl && (
              <button
                type="button"
                onClick={() => handlePlayPronunciation(data.audioUrl)}
                disabled={playingAudioUrl != null}
                className="p-1.5 rounded-full text-[#F5DEB3]/70 hover:bg-[#F5DEB3]/10 transition-colors disabled:opacity-50"
                aria-label="Listen to pronunciation"
              >
                <IconVolume2 className="w-3.5 h-3.5" />
              </button>
            )}
            <Link
              href={`/search/${encodeURIComponent(data.word)}`}
              className="inline-flex items-center rounded-lg bg-[#F5DEB3]/20 px-3 py-1.5 text-[11px] font-medium text-[#F5DEB3] hover:bg-[#F5DEB3]/30 transition-colors"
            >
              {t("viewInDictionary", "View in Dictionary")}
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#F5DEB3]/50">
          {t("noWordAvailable", "No word available today.")}
        </p>
      )}
    </div>
  );
}
