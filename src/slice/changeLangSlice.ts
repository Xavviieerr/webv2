import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "en" | "urhobo";

interface LanguageState {
  language: Language;
}

export const defaultLang: Language = "urhobo";

const storeKey = 'lang';

export const languageStore = {
  setLang(lang: Language): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(storeKey, lang);
      // Also set cookie for server-side middleware access
      document.cookie = `${storeKey}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  },
  getLang: (): Language => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storeKey) || defaultLang) as Language;
    }
    return defaultLang;
  },
  remove(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storeKey);
      // Also remove cookie
      document.cookie = `${storeKey}=; path=/; max-age=0`;
    }
  } 
}

const initialState: LanguageState = {
  language: languageStore.getLang() || defaultLang, // default language
};

const changeLanguageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      languageStore.setLang(state.language);
    },
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "urhobo" : "en";
      languageStore.setLang(state.language);
    },
  },
});

export const { setLanguage, toggleLanguage } = changeLanguageSlice.actions;
export default changeLanguageSlice.reducer;

