"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { IconBell, IconTrash } from "@tabler/icons-react";
import { NotificationList } from "../components/NotificationList";
import { NotificationFilters } from "../components/NotificationFilters";
import {
	useNotificationList,
	useNotificationMutations,
} from "../hooks/useNotifications";
import type { Notification, NotificationQueryParams } from "../types";

export function NotificationPageContainer() {
	const { t } = useTranslation("common");
	const searchParams = useSearchParams();
	const {
		notifications,
		pagination,
		params,
		isLoading,
		isFetching,
		setPage,
		setType,
		setSort,
		setReadFilter,
	} = useNotificationList({ limit: 20 }, { pollingInterval: 60_000, refetchOnMountOrArgChange: true });

	useEffect(() => {
		const filter = searchParams.get("filter");
		if (filter === "unread") {
			setReadFilter(false);
		} else if (filter === "read") {
			setReadFilter(true);
		} else {
			setReadFilter(null);
		}
	}, [searchParams, setReadFilter]);

	const availableTypes = Array.from(
		new Set(notifications.map((n) => n.type).filter(Boolean)),
	);

	const { markAsRead, markAllAsRead, deleteNotification, clearAll } =
		useNotificationMutations();

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

	const handleDelete = useCallback(
		async (notification: Notification) => {
			try {
				await deleteNotification(notification.id);
				toast.success(t("notificationDeleted"));
			} catch {
				toast.error(t("failedToDeleteNotification"));
			}
		},
		[deleteNotification, t],
	);

	const handleClearAll = useCallback(async () => {
		try {
			await clearAll(undefined);
			toast.success(t("allNotificationsCleared"));
		} catch {
			toast.error(t("failedToClearAllNotifications"));
		}
	}, [clearAll, t]);

	const handleTypeChange = useCallback(
		(type: NotificationQueryParams["type"]) => {
			setType(type);
		},
		[setType],
	);

	const handleSortChange = useCallback(
		(
			sortBy: NotificationQueryParams["sortBy"],
			sortDir: NotificationQueryParams["sortDir"],
		) => {
			setSort(sortBy, sortDir);
		},
		[setSort],
	);

	return (
		<div className="flex flex-col gap-4 sm:gap-6 lg:px-30">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-[#1A4349]/10">
						<IconBell className="size-5 text-[#0E808D]" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-[#1A4349]">
							{t("notifications")}
						</h1>
						{pagination && (
							<p className="text-xs text-[#1A4349]/50">
								{t("totalNotifications", { total: pagination.total })}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<NotificationFilters
						activeType={params.type ?? ""}
						sortBy={params.sortBy ?? "createdAt"}
						sortDir={params.sortDir ?? "desc"}
						availableTypes={availableTypes}
						onTypeChange={handleTypeChange}
						onSortChange={handleSortChange}
					/>

					{notifications.length > 0 && (
						<>
							<button
								type="button"
								onClick={handleMarkAllRead}
								className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#0E808D] transition-colors hover:bg-[#D4E8EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]"
							>
								{t("markAllAsRead")}
							</button>
							<button
								type="button"
								onClick={handleClearAll}
								className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
							>
								<IconTrash className="size-3.5" />
								{t("clearAll")}
							</button>
						</>
					)}
				</div>
			</div>

			<div className="rounded-xl border border-[#1A4349]/10 bg-[#F9FAFB]">
				<NotificationList
					notifications={notifications}
					onNotificationClick={handleNotificationClick}
					onMarkAsRead={handleNotificationClick}
					onDelete={handleDelete}
					showActions
					isLoading={isLoading}
					className="min-h-[200px]"
				/>

				{pagination && pagination.totalPages > 1 && (
					<div className="flex items-center justify-between border-t border-[#1A4349]/10 px-4 py-3">
						<p className="text-xs text-[#1A4349]/50">
							{t("pageXofY", { page: pagination.page, total: pagination.totalPages })}
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setPage(pagination.page - 1)}
								disabled={!pagination.hasPrev || isFetching}
								className="rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#1A4349] transition-colors hover:bg-[#D4E8EA] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]"
							>
								{t("previous")}
							</button>
							<button
								type="button"
								onClick={() => setPage(pagination.page + 1)}
								disabled={!pagination.hasNext || isFetching}
								className="rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#1A4349] transition-colors hover:bg-[#D4E8EA] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D]"
							>
								{t("next")}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
