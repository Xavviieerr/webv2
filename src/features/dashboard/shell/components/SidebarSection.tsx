"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { DashboardNavItem } from "@/features/dashboard/shell/constants/nav";
import { isRouteActive } from "@/features/dashboard/shell/utils/isRouteActive";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarSectionProps {
  items: DashboardNavItem[];
  pathname: string | null;
  onItemClick?: () => void;
  label?: string;
  className?: string;
  groupClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  filterActive?: boolean;
}

export function SidebarSection({
  items,
  pathname,
  onItemClick,
  label,
  className,
  groupClassName,
  itemClassName,
  activeClassName,
  filterActive = true,
}: SidebarSectionProps) {
  const visibleItems = filterActive
    ? items.filter((item) => item.isActiveItem === true)
    : items;

  return (
    <SidebarGroup className={groupClassName}>
      {label && (
        <SidebarGroupLabel className="text-[14px] font-semibold uppercase tracking-wider text-[#3B97A1] mt-6 first:mt-0 px-2 leading-[1.2]">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent className={className}>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive = isRouteActive(pathname, item.url, item.exact);
            return (
              <SidebarNavItem
                key={item.title}
                item={item}
                isActive={isActive}
                onClick={onItemClick}
                className={itemClassName}
                activeClassName={activeClassName}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
