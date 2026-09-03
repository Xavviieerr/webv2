export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: string;
  read: boolean;
  createdAt: string;
  timestamp?: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  sortBy?: "createdAt" | "title";
  sortDir?: "asc" | "desc";
  read?: boolean | null;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BackendNotificationItem {
  id: string;
  title: string;
  body?: string;
  message?: string;
  description?: string;
  type: string;
  isRead: boolean;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BackendNotificationsData {
  items: BackendNotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface BackendNotificationsResponse {
  data: BackendNotificationsData;
  message: string;
}

export interface BackendUnreadCountResponse {
  data: { count: number };
  message: string;
}
