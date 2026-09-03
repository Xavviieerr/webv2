import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";

const WordExtrasRow = ({
  translation,
  sense,
}: {
  translation: TranslationPacket["translations"]["en"] | undefined;
  sense: TranslationPacket;
}) => {
  if (
    sense.pluralForms.length === 0 &&
    sense.antonyms.length === 0 &&
    sense.synonyms.length === 0 &&
    sense.relatedWords.length === 0
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-8 pt-4 gap-4 overflow-hidden border-t border-primary/20 capitalize">
      {!!translation?.pluralForms?.length ||
      (!translation && sense.pluralForms.length) ? (
        <div className="flex flex-col justify-between w-full bg-secondary-foreground/5 rounded-lg py-4 gap-2 px-5">
          <p className="font-medium">
            <LocaleWrapper item="plurals" />
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {translation &&
              translation.pluralForms.length > 0 &&
              translation.pluralForms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!translation &&
              sense.pluralForms.length > 0 &&
              sense.pluralForms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show synonyms for both translation and sense */}
      {!!translation?.synonyms?.length ||
      (!translation && sense.synonyms.length) ? (
        <div className="flex flex-col w-full bg-secondary-foreground/5 rounded-lg py-5 gap-2 px-5">
          <p className="font-medium">
            <LocaleWrapper item="synonyms" />
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {translation &&
              translation.synonyms.length > 0 &&
              translation.synonyms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!translation &&
              sense.synonyms.length > 0 &&
              sense.synonyms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show antonyms for both translation and sense */}

      {!!translation?.antonyms?.length ||
      (!translation && sense.antonyms.length) ? (
        <div className="flex flex-col w-full bg-secondary-foreground/5 rounded-lg py-5 gap-2 px-5">
          <p className="font-medium">
            <LocaleWrapper item="antonyms" />
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {translation &&
              translation.antonyms.length > 0 &&
              translation.antonyms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!translation &&
              sense.antonyms.length > 0 &&
              sense.antonyms.map((item, index) => (
                <p key={index} className="shadow px-5 py-2 border border-gray-200 rounded-full w-fit">
                  {item}
                </p>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      {!!translation?.relatedWords?.length ||
      (!translation && sense.relatedWords.length) ? (
        <div className="flex flex-col w-full bg-secondary-foreground/5 rounded-lg py-5 gap-2 px-5">
          <p className="font-medium">
            <LocaleWrapper item="relatedWords" />
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {translation &&
              translation.relatedWords.length > 0 &&
              translation.relatedWords.map((item, index) => (
                <Link
                  key={index}
                  href={`/search/${item}`}
                  className="shadow px-5 py-2 border border-gray-200 hover:border-gray-400 transition-all duration-300 ease-in-out rounded-full w-fit lowercase"
                >
                  {item}
                </Link>
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!translation &&
              sense.relatedWords.length > 0 &&
              sense.relatedWords.map((item, index) => (
                <Link
                  key={index}
                  href={`/search/${item}`}
                  className="shadow px-5 py-2 border border-gray-200 hover:border-gray-400 transition-all duration-300 ease-in-out rounded-full w-fit lowercase"
                >
                  {item}
                </Link>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WordExtrasRow;
