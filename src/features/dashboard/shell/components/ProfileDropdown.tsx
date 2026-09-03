"use client";

import Link from "next/link";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProfileDropdownProps {
  username?: string;
  avatarUrl?: string;
  profileHref?: string;
  settingsHref?: string;
  onLogout?: () => void;
  className?: string;
}

export function ProfileDropdown({
  username = "Username",
  avatarUrl,
  profileHref = "/dashboard/profile",
  settingsHref = "/dashboard/settings",
  onLogout,
  className,
}: ProfileDropdownProps) {
  const { t } = useTranslation("common");
  const initials = username
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-[#D4E8EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2",
            className,
          )}
        >
          <span className="hidden text-sm font-medium text-secondary-foreground sm:inline">
            {username}
          </span>
          <Avatar size="default" className="ring-2 ring-secondary-2">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <IconChevronDown className="size-4 text-muted-text" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-56 rounded-xl border-border/80 p-1.5 shadow-lg"
      >
        <div className="flex items-center gap-3 px-2.5 py-2">
          <Avatar size="default">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium text-secondary-foreground">
            {username}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="rounded-lg py-2 text-sidebar-text">
          <Link href={profileHref}>
            <IconUser />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-lg py-2 text-sidebar-text">
          <Link href={settingsHref}>
            <IconSettings />
            <span>{t("settings")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={onLogout}
          className="rounded-lg py-2"
        >
          <IconLogout />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
