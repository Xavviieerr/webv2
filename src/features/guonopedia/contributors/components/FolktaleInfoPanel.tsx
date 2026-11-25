import type { ReactNode } from "react";

export function FolktaleInfoPanel({
	title,
	icon,
	children,
}: {
	title: string;
	icon: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-3 rounded-2xl border border-[#0D4D4D]/10 bg-[#D4E8EA] p-5">
			<h2 className="flex items-center gap-2 text-sm font-semibold text-[#0D4D4D]">
				<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0D4D4D]">
					{icon}
				</span>
				{title}
			</h2>
			{children}
		</section>
	);
}

export function FolktaleInfoRow({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex min-w-0 items-start justify-between gap-3 text-sm">
			<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50">
				{icon}
				{label}
			</span>
			<span className="min-w-0 break-words text-right font-medium text-[#0D4D4D] [overflow-wrap:anywhere]">
				{value}
			</span>
		</div>
	);
}
