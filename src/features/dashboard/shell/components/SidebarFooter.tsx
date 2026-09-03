"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  SidebarFooter as SidebarFooterPrimitive,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { navUtility } from "@/features/dashboard/shell/constants/nav";

interface SidebarFooterProps {
  onLogout: () => void;
}

export function SidebarFooter({ onLogout }: SidebarFooterProps) {
  const { t } = useTranslation("common");

  return (
    <SidebarFooterPrimitive className="mt-auto px-0 pb-3">
      <SidebarSeparator className="mb-2" />
      <nav aria-label="Footer navigation">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navUtility.map((item) => {
                const label = item.i18nKey ? t(item.i18nKey) : item.title;
                return (
                  <SidebarMenuItem key={item.title} className="relative flex gap-5">
                    {item.isLogout ? (
                      <SidebarMenuButton
                        onClick={onLogout}
                        aria-label={label}
                        className="px-3 py-6 text-base font-normal text-sidebar-text hover:bg-sidebar-active hover:text-sidebar-active-text transition-all rounded-none cursor-pointer"
                      >
                        <item.icon className="size-5 shrink-0" />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className="px-3 py-6 text-base font-normal text-sidebar-text hover:bg-sidebar-active hover:text-sidebar-active-text transition-all rounded-none"
                      >
                        <Link href={item.url ?? "#"}>
                          <item.icon className="size-5 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </nav>
    </SidebarFooterPrimitive>
  );
}
