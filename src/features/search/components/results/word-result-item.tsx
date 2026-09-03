"use client";

import React from "react";
import Link from "next/link";
import {ArrowRight, BookOpenText} from "lucide-react";

interface WordResultItemProps {
  word: SensePacket;
}

export function WordResultItem({word}: WordResultItemProps) {
  const href = word.otaWord
    ? `/search/${word.ota}?otaWord=${word.otaWord}`
    : `/search/${word.ota}`;

  return (
    <Link
      href={href}
      className="flex flex-col w-full gap-1 group hover:border-b border-slate-600/20 cursor-pointer pb-3 transition-all"
    >
      <div className="flex items-center gap-2 text-base font-medium">
        <div className="bg-secondary-foreground/10 rounded-full p-2">
          <BookOpenText strokeWidth={1.2} size={18} />
        </div>

        <div className="flex flex-col">
          <p className="group-hover:underline underline-offset-2">
            {word.otaWord ? (
              <>
                <span>{word.otaWord}</span> -{" "}
                <span className="text-gray-500 font-normal">{word.ota}</span>
              </>
            ) : (
              <>
                <span>{word.ota}</span>
                {" - "}
                {word.senses.map((sense: TranslationPacket, senseIdx: number) => (
                  <span key={sense.kere} className="text-gray-500 font-normal">
                    {sense.translations?.en?.word || ""}
                    {senseIdx < word.senses.length - 1 && <span>, </span>}
                  </span>
                ))}
              </>
            )}
          </p>
        </div>

        <ArrowRight strokeWidth={1.2} className="ml-auto group-hover:block hidden" />
      </div>

      <p className="text-sm text-slate-600/90 line-clamp-1">{word.senses[0]?.definition || ""}</p>
    </Link>
  );
}
