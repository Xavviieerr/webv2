import React from "react";
import { formatSearchResults } from "../../lib/helpers/format-word-search";
import Image from "next/image";
import WordLanguageSwitch from "./language-switch";
import SenseCard from "./sense-card";
import TopWordSection from "./top-section";
import enCommon from "../../../../../public/locales/en/common.json";
import urhoboCommon from "../../../../../public/locales/urhobo/common.json";
import { languageStore } from "@/slice/changeLangSlice";

const Definition = ({
  data,
  slug,
}: {
  data: any[];
  slug: string;
}) => {
  const res = data;
  const lang = languageStore.getLang();
  const t = lang === "urhobo" ? urhoboCommon : enCommon;

  if (!res || res.length == 0)
    return (
      <div className="flex flex-col items-center gap-4 mt-5 text-gray-500 text-center text-sm">
        <Image src={"/images/sad.svg"} alt="sad image" width={80} height={70} />
        <p>{t.noWordsFoundForSearch}</p>
      </div>
    );

  const word = formatSearchResults(res, slug)[0];

  if (!word)
    return (
      <div className="flex flex-col items-center gap-4 mt-5 text-gray-500 text-center text-sm">
        <Image src={"/images/sad.svg"} alt="sad image" width={80} height={70} />
        <p>{t.noWordsFoundForSearch}</p>
      </div>
    );

  return (
    <div className="flex flex-col w-full mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4  w-full border-b border-primary/20 pb-10 mb-10">
        <TopWordSection word={word} />

        <WordLanguageSwitch />
      </div>

      {word.senses.map((sense, senseIndex) => (
        <SenseCard
          key={sense.kere}
          sense={sense}
          slug={slug}
          index={senseIndex}
        />
      ))}
    </div>
  );
};

export default Definition;
