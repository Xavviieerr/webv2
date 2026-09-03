"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DesktopProfileProps {
  user: {
    profilePictureUrl?: string | null;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  initials: string;
  onOpenProfileModal: () => void;
}

export function DesktopProfile({
  user,
  initials,
  onOpenProfileModal,
}: DesktopProfileProps) {
  return (
    <div className="hidden md:block relative cursor-pointer transition-all">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenProfileModal();
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-secondary-foreground/10 border border-green-700/30 hover:border-green-700 rounded-full text-xs font-medium text-gray-700 transition-all focus:outline-none cursor-pointer"
        aria-label="Open Profile"
      >
        <Avatar size="sm" className="cursor-pointer">
          <AvatarImage src={user?.profilePictureUrl || undefined} alt={user?.username || "User"} />
          <AvatarFallback className="bg-secondary-foreground/10 text-green-700">{initials}</AvatarFallback>
        </Avatar>
      </button>
    </div>
  );
}
