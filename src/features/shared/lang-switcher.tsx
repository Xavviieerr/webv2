"use client";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useLanguageSwitch, type Language } from "./use-language-switch";

interface LanguageSwitcherProps {
  /** Compact variant for headers: no outer padding and a tighter control. */
  compact?: boolean;
  className?: string;
}

const LanguageSwitcher = ({
  compact = false,
  className,
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage } = useLanguageSwitch();
  const reduxLanguage = useAppSelector(
    (state: RootState) => state.language.language,
  );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (
    lang: Language,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div
      ref={switcherRef}
      className={cn(!compact && "px-4 py-2", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen((open) => !open);
          }}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-full border border-[#02474F]/15 bg-white font-semibold text-[#02474F] transition-colors hover:border-[#41A3AD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#41A3AD]/50",
            compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-1.5 text-xs",
          )}
        >
          <span>{language === "en" ? "ENG" : "URH"}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 text-[#02474F]/50 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute right-0 top-full z-60 mt-1 w-max min-w-full overflow-hidden rounded-lg border border-[#02474F]/10 bg-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              role="option"
              aria-selected={reduxLanguage === "urhobo"}
              onClick={(event) => select("urhobo", event)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 px-5 py-2 text-xs font-medium transition-colors",
                reduxLanguage === "urhobo"
                  ? "bg-[#D4E8EA] text-[#02474F]"
                  : "text-[#1A4349] hover:bg-[#F2FEFF]",
              )}
            >
              <Image
                src="/images/urhobo.png"
                alt=""
                width={14}
                height={14}
                className="object-contain"
              />
              URH
            </button>

            <button
              type="button"
              role="option"
              aria-selected={reduxLanguage === "en"}
              onClick={(event) => select("en", event)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 px-5 py-2 text-xs font-medium transition-colors",
                reduxLanguage === "en"
                  ? "bg-[#D4E8EA] text-[#02474F]"
                  : "text-[#1A4349] hover:bg-[#F2FEFF]",
              )}
            >
              <Image
                src="/uk-flag.png"
                alt=""
                width={14}
                height={14}
                className="rounded-sm object-contain"
              />
              ENG
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
