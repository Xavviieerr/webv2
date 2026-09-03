"use client";

import React from "react";
import Link from "next/link";
import {ArrowRight, IdCard} from "lucide-react";

interface NameResultItemProps {
  name: {
    id: string;
    name: string;
    nameType: string;
    translations: Array<{translatedMeaning: string; notes: string}>;
  };
}

export function NameResultItem({name}: NameResultItemProps) {
  return (
    <Link
      href={`/dashboard/names/${name.id}`}
      className="flex flex-col w-full gap-1 group hover:border-b border-slate-600/20 cursor-pointer pb-3 transition-all"
    >
      <div className="flex items-center gap-2 text-base font-medium">
        <div className="bg-secondary-foreground/10 rounded-full p-2">
          <IdCard strokeWidth={1.2} size={18} />
        </div>

        <div className="flex flex-col">
          <p className="group-hover:underline underline-offset-2">
            <span className="capitalize">{name.name}</span>
            {" - "}
            <span className="text-gray-500 font-normal">
              {name.translations.length > 0
                ? name.translations.map((t) => t.translatedMeaning).join(", ")
                : name.nameType}
            </span>
          </p>
        </div>

        <ArrowRight strokeWidth={1.2} className="ml-auto group-hover:block hidden" />
      </div>

      {name.translations.length > 0 && (
        <p className="text-sm text-slate-600/90 line-clamp-1">{name.translations[0].notes}</p>
      )}
    </Link>
  );
}
