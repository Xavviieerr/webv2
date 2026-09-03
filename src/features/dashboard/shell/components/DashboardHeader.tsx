"use client";

import { HeaderLogo } from "./HeaderLogo";
import { HeaderProfile } from "./HeaderProfile";
import { HeaderActions } from "./HeaderActions";

export function DashboardHeader() {
	return (
		<header className="fixed top-0 left-0 right-0 z-40 bg-white">
			<div className="flex h-[68px] items-center justify-between gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 lg:px-6 w-full mx-auto">
				<HeaderLogo />

				<div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
					<HeaderActions />
					<HeaderProfile />
				</div>
			</div>
		</header>
	);
}
