"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/types/hooks";
import { useSidebar } from "@/components/ui/sidebar";
import { logoutHandler } from "@/features/auth";

interface DashboardUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
}

export function useDashboardShell() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const user = useAppSelector((state) => state.auth?.user ?? null) as DashboardUser | null;

  const displayName = useMemo(() => {
    if (!user) return undefined;
    return (
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      user.email ||
      "User"
    );
  }, [user]);

  const handleLogout = () => {
    setOpenMobile(false);
    logoutHandler();
    router.push("/home");
  };

  const closeSidebarMobile = () => setOpenMobile(false);

  return {
    user,
    displayName,
    router,
    handleLogout,
    closeSidebarMobile,
  };
}
