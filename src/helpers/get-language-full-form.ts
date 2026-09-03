import { Lang } from "@/features/shared/types";

export const getLanguageFullForm = (lang: Lang) => {
  if (lang === "en") return "English";
  if (lang === "kor") return "Korean";
  return "Urhobo";
};
