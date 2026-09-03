import { useState } from "react";

export function useActiveLanguage(initialLang: "urhobo" | "en" | "kor" = "urhobo") {
  const [activeLang, setActiveLang] = useState<"urhobo" | "en" | "kor">(initialLang);

  return { activeLang, setActiveLang };
}