"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { IconBell } from "@tabler/icons-react";
import { NotificationBell } from "../components/NotificationBell";
import { NotificationList } from "../components/NotificationList";
import { NotificationErrorBoundary } from "../components/NotificationErrorBoundary";
import {
  useUnreadCount,
  useNotificationList,
  useNotificationMutations,
} from "../hooks/useNotifications";
import type { Notification } from "../types";

function NotificationDropdownInner() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useUnreadCount({ pollingInterval: 60_000 });
  const { notifications, isLoading, isFetching, refetch } = useNotificationList(
    { limit: 5 },
    { pollingInterval: 60_000 },
  );
  const { markAsRead, markAllAsRead } = useNotificationMutations();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.read) {
        try {
          await markAsRead(notification.id);
        } catch {
          toast.error(t("failedToMarkAsRead"));
        }
      }
    },
    [markAsRead, t],
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead(undefined);
      toast.success(t("allNotificationsMarkedAsRead"));
    } catch {
      toast.error(t("failedToMarkAllAsRead"));
    }
  }, [markAllAsRead, t]);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        <NotificationBell count={count} />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed md:absolute left-4 md:left-auto right-4 md:right-0 top-[68px] md:top-full mt-0 md:mt-2 z-50 sm:w-96 rounded-xl border border-[#1A4349]/10 bg-white shadow-lg">
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={handleMarkAllRead}
              isLoading={isLoading || isFetching}
            />
            <div className="border-t border-[#1A4349]/10 px-4 py-2.5">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#0E808D] transition-colors hover:text-[#0E808D]/80"
              >
                <IconBell className="size-3.5" />
                {t("viewAllNotifications")}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function NotificationDropdownContainer() {
  return (
    <NotificationErrorBoundary>
      <NotificationDropdownInner />
    </NotificationErrorBoundary>
  );
}
