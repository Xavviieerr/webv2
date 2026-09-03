"use client";

import { useTranslation } from "react-i18next";
import { IconMail, IconMessage } from "@tabler/icons-react";
import { TICKET_CATEGORIES, CONTACT_EMAIL } from "../constants";

interface ContactInfoProps {
  className?: string;
}

export function ContactInfo({ className }: ContactInfoProps) {
  const { t } = useTranslation("common");

  return (
    <div className={className}>
      <h2 className="text-3xl sm:text-4xl font-bold text-[#0D4D4D]">
        {t("howCanWeHelp")}
      </h2>
      <p className="text-[#0D4D4D]/60 text-sm sm:text-base mt-3 leading-relaxed">
        {t("helpSupportDescription")}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
          {t("supportCategories")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TICKET_CATEGORIES).map(([key, { i18nKey, icon: Icon }]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#D4E8EA]/70 text-[#0D4D4D] text-xs font-medium"
            >
              <Icon className="w-3.5 h-3.5 text-[#0E808D]" />
              {t(i18nKey)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
          {t("contactInformation")}
        </h3>

        <div className="flex items-center gap-4 rounded-xl border border-transparent bg-[#D4E8EA]/70 px-4 sm:px-5 py-4 transition-all hover:shadow-lg">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#0D4D4D] shrink-0">
            <IconMail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0D4D4D]">{t("email")}</p>
            <p className="text-xs mt-0.5 text-gray-600 truncate">
              {CONTACT_EMAIL}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-transparent bg-[#D4E8EA]/70 px-4 sm:px-5 py-4 transition-all hover:shadow-lg">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#0D4D4D] shrink-0">
            <IconMessage className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0D4D4D]">{t("responseTime")}</p>
            <p className="text-xs mt-0.5 text-gray-600">
              {t("within24Hours")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
