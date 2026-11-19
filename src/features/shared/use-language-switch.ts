"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import i18n from "@/lib/i18n";
import { setLanguage, type Language } from "@/slice/changeLangSlice";
import { useAppDispatch, useAppSelector } from "@/types/hooks";

/**
 * Pages that exist in both languages. Switching language on one of these
 * navigates to its counterpart instead of reloading the current URL.
 */
const LOCALISED_ROUTES: Record<string, Partial<Record<Language, string>>> = {
  "/home": { en: "/home", urhobo: "/uwevwi" },
  "/uwevwi": { en: "/home", urhobo: "/uwevwi" },
  "/about": { en: "/about", urhobo: "/kpahe" },
  "/kpahe": { en: "/about", urhobo: "/kpahe" },
  "/donate": { en: "/donate", urhobo: "/siobonu" },
  "/siobonu": { en: "/donate", urhobo: "/siobonu" },
};

/**
 * Single source of truth for switching the interface language. Every control
 * (dropdown, segmented toggle, future settings page) goes through this hook so
 * redux, i18n, the cookie/localStorage store and route mapping never drift.
 */
export function useLanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const language = useAppSelector((state) => state.language.language) as Language;
  const dispatch = useAppDispatch();

  // Keep i18next aligned with the stored preference, including on first mount
  // and on any external change to the redux language.
  useEffect(() => {
    if (typeof i18n.changeLanguage === "function") {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  const changeLanguage = useCallback(
    (next: Language) => {
      if (next === language) return;

      dispatch(setLanguage(next));
      if (typeof i18n.changeLanguage === "function") {
        void i18n.changeLanguage(next);
      }

      const mapped = LOCALISED_ROUTES[pathname]?.[next];
      if (mapped && mapped !== pathname) {
        window.setTimeout(() => router.push(mapped), 100);
      }
    },
    [dispatch, language, pathname, router],
  );

  return { language, changeLanguage };
}

export type { Language };
