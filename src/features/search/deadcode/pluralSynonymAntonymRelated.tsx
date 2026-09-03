"use client";
import { Meaning } from "@/slice/wordSlice";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const PluralSynonymAntonymRelated = ({ meaning }: { meaning: Meaning }) => {
  const { t } = useTranslation();
  if (!meaning) return null;

  const handleSynonym = (item: any) => {
    if (typeof item === "string") return item;

    if (item.word) {
      if (typeof item.word === "string") return item.word;
      if (item.word.ota) {
        return item.word.ota;
      } else return String(item.word);
    }

    return String(item);
  };

  const handleAntonym = (item: any) => {
    if (typeof item === "string") return item;
    if (item.ota) return item.ota;

    return String(item);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-206.25 border-t mt-10 pt-5">
      {meaning.plurals && meaning.plurals.length > 0 && (
        <div className="flex gap-2">
          <p>
            <span className="font-medium text-base">{t("plurals")}: </span>
            {meaning.plurals.map((item, index) => (
              <span key={item + index} className="capitalize">
                {item}
                {index != meaning.plurals!.length - 1 && ","}
              </span>
            ))}
          </p>
        </div>
      )}

      {meaning.synonyms && meaning.synonyms.length > 0 && (
        <div className="flex gap-2">
          <p>
            <span className="font-medium text-base">{t("synonyms")}: </span>
            {meaning.synonyms.map((item, index) => (
              <span key={item + index} className="capitalize">
                {handleSynonym(item)}
                {index != meaning.synonyms!.length - 1 && ","}
              </span>
            ))}
          </p>
        </div>
      )}

      {meaning.antonyms && meaning.antonyms.length > 0 && (
        <div className="flex gap-2">
          <p>
            <span className="font-medium text-base">{t("antonyms")}: </span>
            {meaning.antonyms.map((item, index) => (
              <span key={item + index} className="capitalize">
                {handleAntonym(item)}
                {index != meaning.antonyms!.length - 1 && ","}
              </span>
            ))}
          </p>
        </div>
      )}

      {meaning.relatedWords && meaning.relatedWords.length > 0 && (
        <div className="flex flex-col w-full max-w-206.25 border-t pt-5">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-base">{t("relatedWords")}</p>

            <div className="flex flex-wrap gap-3 items-center text-sm">
              {meaning.relatedWords.map((item, index) => (
                <Link
                  href={`?q=${item}`}
                  key={item + index}
                  className="px-5 py-3 border border-dashed rounded-full border-primary/50 hover:bg-primary hover:text-white transition-all duration-300 capitalize cursor-pointer"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluralSynonymAntonymRelated;
