"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { DashboardNavItem } from "@/features/dashboard/shell/constants/nav";

interface SidebarNavItemProps {
	item: DashboardNavItem;
	isActive: boolean;
	onClick?: () => void;
	className?: string;
	activeClassName?: string;
}

export function SidebarNavItem({
	item,
	isActive,
	onClick,
	className,
	activeClassName,
}: SidebarNavItemProps) {
	const { t } = useTranslation("common");
	const label = item.i18nKey ? t(item.i18nKey) : item.title;

	const linkContent = (
		<>
			<item.icon className="size-5 shrink-0" />
			<span>{label}</span>
		</>
	);

	const buttonClasses = cn(
		"px-3 py-6 text-base font-normal transition-all rounded-none",
		isActive
			? "bg-sidebar-active! text-sidebar-active-text! hover:bg-sidebar-active hover:text-sidebar-active-text! rounded-l-md! font-medium! data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-text"
			: "text-sidebar-text hover:bg-sidebar-active hover:text-sidebar-active-text",
		className,
		isActive && activeClassName,
	);

	return (
		<SidebarMenuItem className="relative flex gap-5">
			{isActive && (
				<div className="before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[6px] before:bg-sidebar-active before:rounded-r-full" />
			)}
			<SidebarMenuButton
				asChild
				isActive={isActive}
				data-active={isActive}
				onClick={onClick}
				className={buttonClasses}
			>
				<Link href={item.url ?? "#"}>{linkContent}</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
