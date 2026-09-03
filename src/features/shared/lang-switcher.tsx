"use client";

import i18n from "@/lib/i18n";
import { setLanguage } from "@/slice/changeLangSlice";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LanguageSwitcher = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  //   const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] =
  //     useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const language = useAppSelector(
    (state: RootState) => state.language.language,
  );
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleLanguageSelect = (
    lang: "en" | "urhobo",
    e?: React.MouseEvent | React.TouchEvent,
  ) => {
    // Prevent event propagation to avoid closing dropdown prematurely
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Update Redux state (which also updates localStorage and cookie via the reducer)
    dispatch(setLanguage(lang));
    // Update i18n immediately
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }

    // Close dropdowns
    setIsLanguageDropdownOpen(false);
    // setIsMobileLanguageDropdownOpen(false);

    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      // Redirect to language-specific route if on a language-aware page
      const routeMap: Record<string, { en: string; urhobo: string }> = {
        "/home": { en: "/home", urhobo: "/uwevwi" },
        "/uwevwi": { en: "/home", urhobo: "/uwevwi" },
        "/about": { en: "/about", urhobo: "/kpahe" },
        "/kpahe": { en: "/about", urhobo: "/kpahe" },
        "/donate": { en: "/donate", urhobo: "/siobonu" },
        "/siobonu": { en: "/donate", urhobo: "/siobonu" },
      };

      const currentRoute = routeMap[pathname];
      if (currentRoute && currentRoute[lang] !== pathname) {
        router.push(currentRoute[lang]);
      }
    }, 100);
  };

  // Sync i18n with Redux language state
  useEffect(() => {
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
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
      className="px-4 py-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative group cursor-pointer" ref={languageDropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
          }}
          className="w-full flex gap-2 items-center justify-between px-3 py-1.5 bg-secondary-foreground/10 border border-green-700/30 group-hover:border-green-700 rounded-full text-xs font-medium text-gray-700 transition-all focus:outline-none"
        >
          <span>{language === "en" ? "ENG" : "URH"}</span>
          <ChevronDown
            className={`w-3 h-3 text-gray-500 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isLanguageDropdownOpen && (
          <div
            className="absolute top-full w-fit left-0 right-0 mt-1 bg-secondary-foreground-50/30 border border-green-700/30 rounded-lg shadow-lg overflow-hidden z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageSelect("urhobo", e);
              }}
              className={`w-full flex items-center gap-2 px-5 py-2 text-xs font-medium transition-all cursor-pointer ${
                language === "urhobo"
                  ? "bg-secondary-foreground-50/30 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Image
                src="/images/urhobo.png"
                alt="Urhobo"
                width={14}
                height={14}
                className="object-contain"
              />
              URH
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageSelect("en", e);
              }}
              className={`w-full flex items-center gap-2 px-5 py-2 text-xs font-medium transition-all cursor-pointer ${
                language === "en"
                  ? "bg-secondary-foreground-50/30 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Image
                src="/uk-flag.png"
                alt="UK flag"
                width={14}
                height={14}
                className="object-contain rounded-sm"
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
