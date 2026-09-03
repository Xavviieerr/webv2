"use client";

import { IconTrash, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getNotificationIcon, getNotificationColor } from "../utils";
import type { Notification } from "../types";

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onDelete?: (notification: Notification) => void;
  onMarkAsRead?: (notification: Notification) => void;
  showActions?: boolean;
  className?: string;
}

export function NotificationItem({
  notification,
  onClick,
  onDelete,
  onMarkAsRead,
  showActions = false,
  className,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const isRead = notification.read;

  return (
    <li className="px-1.5">
      <div
        className={cn(
          "group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150",
          isRead
            ? "hover:bg-[#D4E8EA]/20"
            : "bg-[#D4E8EA]/50 hover:bg-[#D4E8EA]/80",
          className,
        )}
      >
        <button
          type="button"
          className="flex flex-1 items-start gap-3 text-left cursor-pointer focus-visible:outline-none"
          onClick={() => onClick?.(notification)}
          aria-label={notification.title}
        >
          <span
            className={cn(
              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ring-4",
              isRead
                ? "bg-[#1A4349]/10 text-[#1A4349]/40 ring-transparent"
                : cn(getNotificationColor(notification.type), "ring-white/60"),
            )}
          >
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "truncate text-sm",
                  isRead
                    ? "font-normal text-[#1A4349]/40"
                    : "font-semibold text-[#1A4349]",
                )}
              >
                {notification.title}
              </span>
              {!isRead && (
                <span className="size-1.5 shrink-0 rounded-full bg-[#0E808D]" />
              )}
            </span>
            {notification.description && (
              <span className="mt-0.5 block text-xs leading-relaxed text-[#1A4349]/50 line-clamp-2">
                {notification.description}
              </span>
            )}
            {notification.timestamp && (
              <span className="mt-1.5 block text-[11px] font-medium text-[#1A4349]/35">
                {notification.timestamp}
              </span>
            )}
          </span>
        </button>

        {showActions && (
          <div className="mt-1 flex shrink-0 items-center gap-1">
            {!isRead && onMarkAsRead && (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification)}
                aria-label="Mark as read"
                className="rounded-lg p-1.5 text-[#0E808D] transition-colors hover:bg-[#D4E8EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]/40"
              >
                <IconCheck className="size-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(notification)}
                aria-label="Delete notification"
                className="rounded-lg p-1.5 text-[#1A4349]/30 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                <IconTrash className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
