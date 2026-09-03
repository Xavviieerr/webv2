import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Preload common namespace so translations are available on first paint (avoids i18n placeholders on load/refresh)
import enCommon from "../../public/locales/en/common.json";
import urhoboCommon from "../../public/locales/urhobo/common.json";

// Get default language from localStorage if available
const getDefaultLang = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || sessionStorage.getItem("lang") || "urhobo";
  }
  return "urhobo";
};

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: getDefaultLang(),
      fallbackLng: "urhobo",
      defaultNS: "common",
      ns: ["common"],
      resources: {
        en: { common: enCommon as Record<string, string> },
        urhobo: { common: urhoboCommon as Record<string, string> },
      },
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "sessionStorage", "navigator"],
        caches: ["localStorage", "sessionStorage"],
        lookupLocalStorage: "lang",
        lookupSessionStorage: "lang",
      },
      react: {
        useSuspense: false,
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
    });
}

export default i18n;

