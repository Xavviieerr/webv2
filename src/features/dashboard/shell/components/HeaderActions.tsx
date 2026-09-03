"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSwitcher } from "@/features/shared";
import { NotificationDropdownContainer } from "@/features/dashboard/notifications";

export function HeaderActions() {
	return (
		<>
			<SidebarTrigger className="md:hidden fixed left-2 top-1/2 -translate-y-1/2 z-50 size-8 rounded-full bg-[#0E808D] text-white shadow-lg hover:bg-[#0E808D]/90" />
			<LanguageSwitcher />
			<NotificationDropdownContainer />
		</>
	);
}
