"use client";

import React from "react";
import Image from "next/image";
import {ChevronDown} from "lucide-react";
import {useAppDispatch} from "@/types/hooks";
import {setLanguage} from "@/slice/changeLangSlice";
import i18n from "@/lib/i18n";
import {useTranslation} from "react-i18next";

interface LanguageDropdownProps {
  language: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  variant?: "desktop" | "mobile";
  redirectFn?: (lang: "en" | "urhobo") => void;
}

export function LanguageDropdown({
  language,
  isOpen,
  onToggle,
  onClose,
  variant = "desktop",
  redirectFn,
}: LanguageDropdownProps) {
  const dispatch = useAppDispatch();
  const {t} = useTranslation("common");

  const handleSelect = (lang: "en" | "urhobo", e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    dispatch(setLanguage(lang));
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    onClose();
    if (redirectFn) {
      setTimeout(() => redirectFn(lang), 100);
    }
  };

  if (variant === "mobile") {
    return (
      <div className="px-4 py-2 border-t border-gray-200 mt-2">
        <p className="text-xs text-gray-500 mb-2">{t("preferredLanguage")}</p>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#05353A]/10 rounded-full text-[10px] sm:text-xs font-medium text-[#05353A] transition-all hover:bg-[#05353A]/20"
          >
            {language === "en" ? "ENG" : "URH"}
            <svg
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-60">
              <LanguageOptions language={language} onSelect={handleSelect} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-all focus:outline-none"
      >
        <span>{language === "en" ? "ENG" : "URH"}</span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-60">
          <LanguageOptions language={language} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}

function LanguageOptions({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (lang: "en" | "urhobo", e?: React.MouseEvent | React.TouchEvent) => void;
}) {
  return (
    <>
      <button
        onClick={(e) => onSelect("urhobo", e)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
          language === "urhobo" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Image src="/images/urhobo.png" alt="Urhobo" width={14} height={14} className="object-contain" />
        URH
      </button>
      <button
        onClick={(e) => onSelect("en", e)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
          language === "en" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Image src="/uk-flag.png" alt="UK flag" width={14} height={14} className="object-contain rounded-sm" />
        ENG
      </button>
    </>
  );
}
