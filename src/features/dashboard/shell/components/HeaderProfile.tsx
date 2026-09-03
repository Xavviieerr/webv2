"use client";

import { ProfileDropdown } from "./ProfileDropdown";
import { useDashboardShell } from "../hooks/useDashboardShell";

export function HeaderProfile() {
  const { displayName, user, handleLogout } = useDashboardShell();

  return (
    <ProfileDropdown
      username={displayName}
      avatarUrl={user?.profilePictureUrl}
      onLogout={handleLogout}
    />
  );
}
