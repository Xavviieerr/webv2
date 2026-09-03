import i18n from "@/lib/i18n";
import { languageStore, setLanguage } from "@/slice/changeLangSlice";
import { useAppDispatch } from "@/types/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const useInitTranslation = () => {
    const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Running this shit");
    const lang = languageStore.getLang();
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    dispatch(setLanguage(lang));
  }, [pathname, dispatch]);
}