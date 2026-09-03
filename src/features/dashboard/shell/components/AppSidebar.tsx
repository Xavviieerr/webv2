"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import {
  navPrimary,
} from "@/features/dashboard/shell/constants/nav";
import { SidebarSection } from "./SidebarSection";
import { SidebarFooter } from "./SidebarFooter";
import { useDashboardShell } from "../hooks/useDashboardShell";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { handleLogout, closeSidebarMobile } = useDashboardShell();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="custom-scrollbar">
        <SidebarSection
          items={navPrimary}
          pathname={pathname}
          onItemClick={closeSidebarMobile}
          groupClassName="px-0 mt-10"
          className="flex flex-col gap-1"
        />

        <SidebarFooter onLogout={handleLogout} />
      </SidebarContent>
    </Sidebar>
  );
}
