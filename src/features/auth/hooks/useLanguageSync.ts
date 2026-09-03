import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import { setLanguage } from "@/slice/changeLangSlice";
import i18n from "@/lib/i18n";

export function useLanguageSync() {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state: RootState) => state.language);
  const { t, i18n: i18nInstance } = useTranslation("common");

  useEffect(() => {
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    }
    dispatch(setLanguage(language));
  }, [language, dispatch]);

  const toggleLanguage = useCallback(() => {
    const next =
      (typeof i18n.language !== "undefined" ? i18n.language : language) === "en"
        ? "urhobo"
        : "en";
    dispatch(setLanguage(next));
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(next);
    }
  }, [language, dispatch]);

  return { t, language, toggleLanguage, i18n: i18nInstance };
}
