import { LocaleWrapper } from "@/features/shared";
import React from "react";

const MeaningSection = ({
  sense,
  translation,
}: {
  sense: TranslationPacket;
  translation: TranslationPacket["translations"]["en"] | undefined;
}) => {
  return (
    <div className="flex flex-col gap-2 my-8 border-y border-primary/20 py-8 font-medium text-base">
      <span className="font-semibold">
        <LocaleWrapper item="definition" />
      </span>

      <div className="flex flex-col gap-1">
        <p>{sense.definition}</p>

        {translation && (
          <p className="ml-1 font-normal border-l-2 border-primary/50 pl-2 text-muted-text">
            {translation.definition}
          </p>
        )}
      </div>
    </div>
  );
};

export default MeaningSection;
