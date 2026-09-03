"use client";

import { useTranslation } from "react-i18next";
import { IconBell } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  count: number;
  className?: string;
}

export function NotificationBell({ count, className }: NotificationBellProps) {
  const { t } = useTranslation("common");
  const displayCount = count > 9 ? "9+" : String(count);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="relative rounded-lg p-2 text-[#1A4349] transition-colors hover:bg-[#D4E8EA]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]"
        aria-label={count > 0 ? t("notificationsUnread", { count }) : t("notifications")}
      >
        <IconBell className="size-5" />
        {count > 0 && (
          <span
            role="status"
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#0E808D] text-[10px] font-bold text-white"
          >
            {displayCount}
          </span>
        )}
      </button>
    </div>
  );
}
