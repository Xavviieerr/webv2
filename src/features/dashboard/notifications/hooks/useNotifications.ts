import { useState, useCallback, useMemo } from "react";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from "../api/notificationEndpoints";
import type { NotificationQueryParams } from "../types";
import { NOTIFICATION_PAGE_SIZE } from "../constants";

export function useNotificationList(
  initialParams: NotificationQueryParams = {},
  options?: { pollingInterval?: number; refetchOnMountOrArgChange?: boolean },
) {
  const [params, setParams] = useState<NotificationQueryParams>({
    page: 1,
    limit: NOTIFICATION_PAGE_SIZE,
    ...initialParams,
  });

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery(params, {
    pollingInterval: options?.pollingInterval,
    refetchOnMountOrArgChange: options?.refetchOnMountOrArgChange,
  });

  const setPage = useCallback(
    (page: number) => setParams((p) => ({ ...p, page })),
    [],
  );

  const setType = useCallback(
    (type: NotificationQueryParams["type"]) =>
      setParams((p) => ({ ...p, type, page: 1 })),
    [],
  );

  const setSort = useCallback(
    (
      sortBy: NotificationQueryParams["sortBy"],
      sortDir: NotificationQueryParams["sortDir"],
    ) => setParams((p) => ({ ...p, sortBy, sortDir, page: 1 })),
    [],
  );

  const setReadFilter = useCallback(
    (read: boolean | null) => setParams((p) => ({ ...p, read: read ?? undefined, page: 1 })),
    [],
  );

  const rawNotifications = data?.notifications;
  const notifications = useMemo(() => {
    if (!Array.isArray(rawNotifications)) return [];
    const sorted = [...rawNotifications];
    if (params.sortBy === "title") {
      sorted.sort((a, b) => {
        const cmp = a.title.localeCompare(b.title);
        return params.sortDir === "asc" ? cmp : -cmp;
      });
    } else {
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return params.sortDir === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return sorted;
  }, [rawNotifications, params.sortBy, params.sortDir]);
  const pagination = data?.pagination ?? null;

  return {
    notifications,
    pagination,
    params,
    isLoading,
    isFetching,
    refetch,
    setPage,
    setType,
    setSort,
    setReadFilter,
  };
}

export function useUnreadCount(options?: { pollingInterval?: number }) {
  const { data: count = 0, isLoading } = useGetUnreadCountQuery(undefined, {
    pollingInterval: options?.pollingInterval ?? 60_000,
  });
  return { count, isLoading };
}

export function useNotificationMutations() {
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearAll] = useClearAllNotificationsMutation();

  return { markAsRead, markAllAsRead, deleteNotification, clearAll };
}
