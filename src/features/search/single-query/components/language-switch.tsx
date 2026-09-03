"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useQueryCtx } from "@/features/search/lib/context";
import { Lang } from "@/features/shared/types";

const lang = [
  { label: "urh", value: "urhobo" },
  { label: "en", value: "en" },
  { label: "kor", value: "kor" },
];

const WordLanguageSwitch = () => {
  const { wordLanguage, setWordLanguage } = useQueryCtx();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={switcherRef}
      className="flex items-center gap-4 text-sm relative border hover:border-2 transition-all duration-200 rounded-md border-primary/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-5 py-1.5 cursor-pointer"
      >
        <p className="font-medium uppercase">
          {lang.find((item) => item.value === wordLanguage)?.label}
        </p>

        <ChevronDown
          size={20}
          className={`mt-0.5 ${isOpen ? "rotate-180" : ""}  transition-all duration-300`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-10 z-50 w-full capitalize rounded-md left-0 border p-2 bg-white shadow-xl flex flex-col gap-2">
          {lang.map((item) => (
            <button
              key={item.value}
              className="p-1.5 hover:bg-secondary-foreground/10 hover:font-medium capitalize cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setWordLanguage(item.value as Lang);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordLanguageSwitch;
