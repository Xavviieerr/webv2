import { LocaleWrapper } from "@/features/shared";
import { Volume2 } from "lucide-react";
import React from "react";

const ExamplesSection = ({
  sense,
  translation,
  handlePlay,
}: {
  sense: TranslationPacket;
  translation: TranslationPacket["translations"]["en"] | undefined;
  handlePlay: (url: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4 text-base">
      <span className="font-semibold">
        <LocaleWrapper item="examples" />
      </span>

      <div className="flex flex-col gap-4">
        {sense.examples.map((item, i) => {
          const translated = translation?.examples?.[i];
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <p>
                  {i + 1}. {item.sentence}
                </p>
                {item.audioUrl && (
                  <button
                    onClick={() => handlePlay(item.audioUrl ?? "")}
                    className="cursor-pointer"
                  >
                    <Volume2 strokeWidth={1.3} size={18} />
                  </button>
                )}
              </div>

              {translated && (
                <div className="flex items-center gap-4 text-muted-text">
                  <p className="ml-1 border-l-2 border-primary/50 pl-2">
                    {translated.sentence}
                  </p>

                  {translated.audioUrl && (
                    <button
                      onClick={() => handlePlay(translated.audioUrl ?? "")}
                      className="cursor-pointer"
                    >
                      <Volume2 strokeWidth={1.3} size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamplesSection;
