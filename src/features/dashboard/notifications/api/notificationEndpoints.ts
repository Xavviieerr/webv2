import { apiSlice } from "@/slice/requestSlice";
import type {
  BackendNotificationsResponse,
  BackendUnreadCountResponse,
  NotificationQueryParams,
} from "../types";
import type { Notification, NotificationPagination } from "../types";
import { mapApiNotification } from "../utils";
import { NOTIFICATION_PAGE_SIZE } from "../constants";

type NotificationQueryResult = {
  notifications: Notification[];
  pagination: NotificationPagination;
};

function patchAllNotificationQueries(
  dispatch: (action: any) => any,
  getState: () => unknown,
  updater: (draft: NotificationQueryResult) => void,
) {
  const state = getState() as Record<string, unknown>;
  const reducerState = state[apiSlice.reducerPath] as
    | { queries?: Record<string, { originalArgs?: NotificationQueryParams }> }
    | undefined;
  const queries = reducerState?.queries ?? {};
  const patches: { undo: () => void }[] = [];

  for (const [, queryCache] of Object.entries(queries)) {
    if (queryCache?.originalArgs !== undefined) {
      patches.push(
        dispatch(
          notificationEndpoints.util.updateQueryData(
            "getNotifications",
            queryCache.originalArgs,
            updater,
          ),
        ),
      );
    }
  }

  return patches;
}

export const notificationEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationQueryResult, NotificationQueryParams>({
      query: (params: NotificationQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params.page ?? 1));
        searchParams.set("limit", String(params.limit ?? NOTIFICATION_PAGE_SIZE));
        searchParams.set("sortBy", params.sortBy ?? "createdAt");
        searchParams.set("sortDir", (params.sortDir ?? "desc").toUpperCase());
        if (params.type) searchParams.set("type", params.type);
        if (params.read != null) searchParams.set("read", String(params.read));
        return `/notifications?${searchParams.toString()}`;
      },
      transformResponse: (response: unknown) => {
        try {
          const res = response as BackendNotificationsResponse;
          const items = res?.data?.items ?? [];
          const pagination = res?.data;
          return {
            notifications: items.map(mapApiNotification),
            pagination: {
              page: pagination?.page ?? 1,
              limit: pagination?.limit ?? NOTIFICATION_PAGE_SIZE,
              total: pagination?.total ?? 0,
              totalPages: pagination?.totalPages ?? 1,
              hasNext: pagination?.hasNext ?? false,
              hasPrev: pagination?.hasPrev ?? false,
            },
          };
        } catch {
          return {
            notifications: [],
            pagination: {
              page: 1,
              limit: NOTIFICATION_PAGE_SIZE,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map((n) => ({
                type: "Notification" as const,
                id: n.id,
              })),
              { type: "Notification" as const, id: "LIST" },
            ]
          : [{ type: "Notification" as const, id: "LIST" }],
    }),

    getUnreadCount: builder.query<number, void>({
      query: () => "/notifications/unread-count",
      transformResponse: (response: unknown) => {
        try {
          const res = response as BackendUnreadCountResponse;
          return res?.data?.count ?? 0;
        } catch {
          return 0;
        }
      },
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patches = patchAllNotificationQueries(dispatch, getState, (draft) => {
          const notification = draft.notifications.find((n) => n.id === id);
          if (notification) notification.read = true;
        });
        try {
          await queryFulfilled;
        } catch {
          for (const p of patches) p.undo();
        }
      },
      invalidatesTags: (_result, _err, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        const patches = patchAllNotificationQueries(dispatch, getState, (draft) => {
          for (const notification of draft.notifications) {
            notification.read = true;
          }
        });
        try {
          await queryFulfilled;
        } catch {
          for (const p of patches) p.undo();
        }
      },
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    clearAllNotifications: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} = notificationEndpoints;
