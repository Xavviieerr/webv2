"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { RootState } from "@/store/store";
import { setLanguage } from "@/slice/changeLangSlice";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const legalLinks = [
  { label: "termsAndConditions", href: "/terms" },
  { label: "privacyPolicy", href: "/privacy" },
];

const getNavLinks = (language: "en" | "urhobo") => [
  { title: "Guọnọ", link: "/" },
  { title: "about", link: language === "en" ? "/about" : "/kpahe" },
  { title: "Guọnọpedia", link: "/encyclopedia" },
  { title: "donate", link: language === "en" ? "/donate" : "/siobonu" },
];

const LandingFooter = () => {
  const { t, i18n } = useTranslation("common");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const language = useAppSelector((state: RootState) => state.language.language);
  const navLinks = getNavLinks(language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLanguageToggle = (lang: "en" | "urhobo") => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false);

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
  };

  return (
    <footer className="bg-[#05353A] text-[#f0f0f0] w-full py-3 px-4 md:py-4 md:px-6 border-t border-[#152729] ">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm lg:text-base">

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-3 sm:gap-4 md:gap-8 capitalize">
          {navLinks.map(({ link, title }, idx) => (
            <Link
              key={idx}
              href={link}
              className=" transition-colors duration-200"
            >
              {t(title)}
            </Link>
          ))}
        </nav>

        {/* Divider (desktop only) */}
        <div className="hidden md:block h-5 w-px bg-[#254045]"></div>

        {/* Language Dropdown and Legal Links - Side by side */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-row-reverse">
          {/* Language Dropdown - Hidden on mobile */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-[10px] sm:text-xs font-medium transition-all hover:bg-white/20"
            >
              {language === "en" ? "ENG" : "URH"}
              <svg
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                <button
                  onClick={() => handleLanguageToggle("urhobo")}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "urhobo"
                    ? "bg-white/20 text-white"
                    : "text-gray-300 hover:bg-white/10"
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
                  onClick={() => handleLanguageToggle("en")}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "en"
                    ? "bg-white/20 text-white"
                    : "text-gray-300 hover:bg-white/10"
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

          {/* Legal Links */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-xs md:text-sm">
            {legalLinks.map(({ label, href }, idx) => (
              <Link
                key={idx}
                href={href}
                className="hover:text-gray-300 transition-colors"
              >
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
