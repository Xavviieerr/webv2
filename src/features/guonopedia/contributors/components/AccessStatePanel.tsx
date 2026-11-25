"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";

interface AccessStatePanelProps {
	icon: ReactNode;
	title: string;
	description: string;
	actionHref?: string;
	actionLabel?: string;
}

/**
 * Shared state card for contributor access screens: signed out, not applied,
 * pending review, rejected and suspended all use the same surface.
 */
export function AccessStatePanel({
	icon,
	title,
	description,
	actionHref,
	actionLabel,
}: AccessStatePanelProps) {
	return (
		<section className="flex flex-col items-start gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-6">
			<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D4D4D]">
				{icon}
			</span>
			<h2 className="text-lg font-semibold text-[#0D4D4D]">{title}</h2>
			<p className="max-w-xl text-sm leading-relaxed text-gray-600">
				{description}
			</p>
			{actionHref && actionLabel && (
				<Link
					href={actionHref}
					className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				>
					{actionLabel}
					<IconArrowRight className="h-4 w-4" />
				</Link>
			)}
		</section>
	);
}
