import { getNotificationTypeStyle } from "../constants";
import type { BackendNotificationItem, Notification } from "../types";

export function getNotificationIcon(type: string) {
  return getNotificationTypeStyle(type).icon;
}

export function getNotificationColor(type: string) {
  const entry = getNotificationTypeStyle(type);
  return `${entry.color} ${entry.bgColor}`;
}

export function mapApiNotification(item: BackendNotificationItem): Notification {
  return {
    id: item.id,
    title: item.title,
    description: item.body ?? item.description ?? item.message,
    type: item.type || "info",
    read: item.read ?? item.isRead,
    createdAt: item.createdAt,
    timestamp: formatRelativeTime(item.createdAt),
  };
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
