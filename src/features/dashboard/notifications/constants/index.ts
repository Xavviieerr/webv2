import { IconInfoCircle, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react";

export const NOTIFICATION_PAGE_SIZE = 20;

const DEFAULT_TYPE_STYLE = { icon: IconInfoCircle, color: "text-[#0E808D]", bgColor: "bg-[#0E808D]/10" };

export const NOTIFICATION_TYPE_MAP: Record<
  string,
  { icon: typeof IconInfoCircle; color: string; bgColor: string }
> = {
  info: { icon: IconInfoCircle, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  success: { icon: IconCircleCheck, color: "text-green-500", bgColor: "bg-green-500/10" },
  warning: { icon: IconAlertTriangle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  error: { icon: IconAlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
  general: { icon: IconInfoCircle, color: "text-[#0E808D]", bgColor: "bg-[#0E808D]/10" },
};

export function getNotificationTypeStyle(type: string) {
  return NOTIFICATION_TYPE_MAP[type] ?? DEFAULT_TYPE_STYLE;
}

export const NOTIFICATION_SORT_OPTIONS = [
  { value: "createdAt:desc", i18nKey: "newest" },
  { value: "createdAt:asc", i18nKey: "oldest" },
  { value: "title:asc", i18nKey: "sortAZ" },
] as const;
