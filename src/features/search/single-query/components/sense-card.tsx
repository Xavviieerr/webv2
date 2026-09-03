"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useQueryCtx } from "@/features/search/lib/context";
import { playAudio } from "../../lib/helpers/play-audio";
import WordExtrasRow from "./word-extras-row";
import ExamplesSection from "./examples-section";
import MeaningSection from "./meaning-section";
import WordSection from "./word-section";
import { getLanguageFullForm } from "@/helpers";
import { useTranslation } from "react-i18next";

const SenseCard = ({
  sense,
  slug,
  index,
}: {
  sense: TranslationPacket;
  slug: string;
  index: number;
}) => {
  const { t } = useTranslation("common");
  const { wordLanguage } = useQueryCtx();
  const translation = sense.translations[wordLanguage];

  const [playing, setPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (url: string) => {
    if (!url) return;

    playAudio({
      url,
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };

  if (translation && !translation.word) {
    return (
      <div className="flex flex-col items-center gap-4 mt-5 text-gray-500 text-center text-sm">
        <Image src={"/images/sad.svg"} alt="sad image" width={80} height={70} />
        <p>
          {t("noTranslationAvailable", { language: getLanguageFullForm(wordLanguage) })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full border-b border-primary/20 pb-10  mb-8">
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full gap-4">
          <div className="w-full">
            <WordSection
              sense={sense}
              translation={translation}
              handlePlay={handlePlay}
              slug={slug}
              index={index}
            />

            {sense.image && (
              <div className="w-32 h-28 md:hidden relative bg-slate-100 rounded-md my-4">
                <Image
                  src={sense.image}
                  alt={sense.word}
                  fill
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          {sense.image && (
            <div className="w-32 h-28 max-md:hidden relative bg-slate-100 rounded-md">
              <Image
                src={sense.image}
                alt={sense.word}
                fill
                className="rounded-md"
              />
            </div>
          )}
        </div>

        <MeaningSection sense={sense} translation={translation} />

        <ExamplesSection
          sense={sense}
          translation={translation}
          handlePlay={handlePlay}
        />

        <WordExtrasRow translation={translation} sense={sense} />
      </div>
    </div>
  );
};

export default SenseCard;
