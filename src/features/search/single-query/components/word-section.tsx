import React from "react";
import { Volume2 } from "lucide-react";

const WordSection = ({
  sense,
  translation,
  handlePlay,
  slug,
  index,
}: {
  sense: TranslationPacket;
  translation: TranslationPacket["translations"]["en"] | undefined;
  handlePlay: (url: string) => void;
  slug: string;
  index: number;
}) => {
  return (
    <>
      <div className="text-2xl font-medium lowercase flex items-center gap-1">
        <div className="px-4 py-1.5 text-white text-base font-medium rounded-full bg-secondary-foreground w-fit mr-2">
          <span>{index + 1}</span>
        </div>

        {translation &&
          translation.word.toLowerCase() != slug.toLowerCase() && (
            <span>{translation.word} - </span>
          )}
        {!translation && sense.word.toLowerCase() !== slug.toLowerCase() && (
          <span>{sense.word} - </span>
        )}
        {translation ? (
          <span className="font-normal text-muted-text text-xl">
            {translation.partOfSpeech}
          </span>
        ) : (
          <span className="font-normal text-muted-text text-xl">
            {sense.partOfSpeech}
          </span>
        )}
      </div>

      {translation ? (
        <div className="flex items-center gap-4 mt-5 text-base ">
          {translation.audio && (
            <button
              onClick={() => handlePlay(translation.audio ?? "")}
              className="cursor-pointer"
            >
              <Volume2 strokeWidth={1.3} size={24} fill="#02474F" />
            </button>
          )}
          {translation.ipa && (
            <span className="bg-[#05353a20] px-5 py-2 rounded-full">
              /{translation.ipa}/
            </span>
          )}
          {translation.pronunciation && (
            <span className="bg-secondary-foreground/70 text-white px-5 py-2 rounded-full">
              [{translation.pronunciation}]
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 mt-5 text-base">
          {sense.audio && (
            <button
              onClick={() => handlePlay(sense.audio ?? "")}
              className="cursor-pointer"
            >
              <Volume2 strokeWidth={1.3} size={24} fill="#02474F" />
            </button>
          )}
          <span className="bg-[#05353a20] px-5 py-2 rounded-full">
            /{sense.ipa}/
          </span>
          <span className="bg-secondary-foreground/70 text-white px-5 py-2 rounded-full">
            [{sense.pronunciation}]
          </span>
        </div>
      )}
    </>
  );
};

export default WordSection;
