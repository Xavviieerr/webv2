"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { NotificationItem } from "./NotificationItem";
import { NotificationEmpty } from "./NotificationEmpty";
import { NotificationSkeleton } from "./NotificationSkeleton";
import type { Notification } from "../types";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onMarkAsRead?: (notification: Notification) => void;
  onDelete?: (notification: Notification) => void;
  showActions?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function NotificationList({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onMarkAsRead,
  onDelete,
  showActions = false,
  isLoading = false,
  className,
}: NotificationListProps) {
  const { t } = useTranslation("common");

  if (isLoading && notifications.length === 0) {
    return <NotificationSkeleton count={showActions ? 8 : 5} />;
  }

  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {!showActions && onMarkAllRead && notifications.some((n) => !n.read) && (
        <>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-[#1A4349]">
              {t("notifications")}
            </p>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-md px-1.5 py-0.5 text-xs font-medium text-[#0E808D] transition-colors hover:bg-[#D4E8EA] hover:text-[#0E808D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]"
            >
              {t("markAllAsRead")}
            </button>
          </div>
          <div className="h-px w-full bg-[#1A4349]/10" />
        </>
      )}

      <ul
        className={cn(
          "flex flex-col py-1.5 gap-2",
          showActions
            ? "flex-1"
            : "max-h-[360px] overflow-y-auto custom-scrollbar",
        )}
        aria-label={t("notifications")}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
            onDelete={onDelete}
            onMarkAsRead={onMarkAsRead}
            showActions={showActions}
          />
        ))}
      </ul>
    </div>
  );
}
