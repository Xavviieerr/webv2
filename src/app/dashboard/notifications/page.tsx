import type { Metadata } from "next";
import { NotificationPageWrapper } from "@/features/dashboard/notifications/components/NotificationPageWrapper";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  return <NotificationPageWrapper />;
}
