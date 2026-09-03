"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/slice/changeLangSlice";
import { RootState } from "@/store/store";
import i18n from "@/lib/i18n";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { useGetMeQuery } from "@/features/auth";
import { logoutHandler } from "@/features/auth";
import { SETTINGS_COLORS as COLORS } from "../constants";
import { SecuritySection } from "./SecuritySection";
import type { User as AppUser } from "@/types";
import type { SecurityView } from "../types";

export function SettingsPage() {
  const { t } = useTranslation("common");
  const [securityView, setSecurityView] = useState<SecurityView>("list");
  const isMobile = useIsMobile();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const language = useAppSelector((state: RootState) => state.language.language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const reduxUser = useAppSelector((state) => state.auth?.user ?? null);
  const { data: profile, isLoading, error, refetch } = useGetMeQuery();
  const user = (reduxUser && profile
    ? { ...reduxUser, ...profile }
    : profile ?? reduxUser) as AppUser | null | undefined;

  const handleLanguageSelect = (lang: "en" | "urhobo") => {
    dispatch(setLanguage(lang));
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    setIsLanguageDropdownOpen(false);
  };

  const handleLogout = () => {
    logoutHandler();
    router.push("/signin");
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className={cn(
        "w-full min-h-[calc(100vh-var(--top-banners-height,65px))] sm:min-h-0 flex flex-col",
        !isMobile && "max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[#0D4D4D]/10 shadow-lg mt-4 sm:mt-6",
      )}
    >
      <div className="flex flex-col lg:flex-row min-h-[70vh] sm:min-h-[520px] w-full">
        <aside
          className={cn(
            "shrink-0 flex flex-col p-5 sm:p-6",
            "w-full lg:w-[260px] xl:w-[280px] rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none",
          )}
          style={{ backgroundColor: COLORS.pageBg }}
        >
          <button
            type="button"
            className="flex items-center gap-2 mb-6 justify-start px-0 text-[#6A6A6A] hover:text-[#1A1A1A] transition-colors"
            onClick={handleBack}
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span>{t("back")}</span>
          </button>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: COLORS.primaryText }}>
              {t("settings")}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: COLORS.secondaryText }}>
              {t("manageYourAccount")}
            </p>
          </div>

          <div className="mt-auto space-y-6 pt-8">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                aria-expanded={isLanguageDropdownOpen}
                aria-haspopup="listbox"
                className="w-fit flex items-center justify-between gap-2 rounded-full border py-2 px-4 text-sm font-medium transition-colors hover:bg-[#0D4D4D]/10"
                style={{
                  borderColor: `${COLORS.primaryText}33`,
                  color: COLORS.secondaryText,
                }}
              >
                <span>{language === "en" ? "ENG" : "URH"}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isLanguageDropdownOpen && "rotate-180",
                  )}
                />
              </button>
              {isLanguageDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute bottom-full left-0 right-0 mb-2 border rounded-lg shadow-lg overflow-hidden z-50"
                  style={{ backgroundColor: COLORS.pageBg, borderColor: `${COLORS.primaryText}26` }}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === "urhobo"}
                    onClick={() => handleLanguageSelect("urhobo")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all",
                      language === "urhobo"
                        ? "text-[#FFFFFF]"
                        : "text-[#6A6A6A] hover:bg-[#0D4D4D]/10",
                    )}
                    style={{
                      backgroundColor: language === "urhobo" ? COLORS.accentTeal : "transparent",
                    }}
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
                    type="button"
                    role="option"
                    aria-selected={language === "en"}
                    onClick={() => handleLanguageSelect("en")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all",
                      language === "en"
                        ? "text-[#FFFFFF]"
                        : "text-[#6A6A6A] hover:bg-[#0D4D4D]/10",
                    )}
                    style={{
                      backgroundColor: language === "en" ? COLORS.accentTeal : "transparent",
                    }}
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

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-sm font-medium rounded-lg px-3 py-2.5 -mx-1 transition-colors hover:bg-red-500/10"
              style={{ color: COLORS.accentRed }}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </aside>

        <main
          className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none"
          style={{ backgroundColor: COLORS.contentBg }}
        >
          <div className="flex items-center gap-2 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#0D4D4D]/10 shrink-0">
            <h1 className="text-lg sm:text-xl font-semibold truncate" style={{ color: COLORS.primaryText }}>
              {t("security")}
            </h1>
          </div>

          <div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
            {isLoading ? (
              <div className="p-4 sm:p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: COLORS.cardBg }} />
                ))}
              </div>
            ) : error && !user ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <p className="text-sm" style={{ color: COLORS.secondaryText }}>{t("failedToLoadProfile")}</p>
                <button
                  onClick={() => refetch()}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: COLORS.accentTeal }}
                >
                  {t("tryAgain")}
                </button>
              </div>
            ) : (
              <SecuritySection
                view={securityView}
                onViewChange={setSecurityView}
                user={user}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
