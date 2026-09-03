"use client";

import { useTranslation } from "react-i18next";
import { IconBellOff } from "@tabler/icons-react";

interface NotificationEmptyProps {
  className?: string;
}

export function NotificationEmpty({ className }: NotificationEmptyProps) {
  const { t } = useTranslation("common");

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className ?? ""}`}>
      <div className="rounded-full bg-[#1A4349]/5 p-4 mb-4">
        <IconBellOff className="size-8 text-[#1A4349]/30" />
      </div>
      <p className="text-sm font-medium text-[#1A4349]">{t("allCaughtUp")}</p>
      <p className="text-xs text-[#1A4349]/50 mt-1">
        {t("newNotificationsWillAppear")}
      </p>
    </div>
  );
}
