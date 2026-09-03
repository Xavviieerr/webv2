"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	IconSend,
	IconPlayerStop,
	IconChevronDown,
} from "@tabler/icons-react";

interface StatusDropdownProps {
	value: "published" | "draft";
	onChange: (value: "published" | "draft") => void;
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
	const { t } = useTranslation("common");
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback((e: MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			setOpen(false);
		}
	}, []);

	useEffect(() => {
		if (!open) return;
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open, handleClickOutside]);

	const options = [
		{
			value: "published" as const,
			label: t("published", "Published"),
			icon: IconSend,
		},
		{
			value: "draft" as const,
			label: t("draft", "Draft"),
			icon: IconPlayerStop,
		},
	];

	const current = options.find((o) => o.value === value);

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="inline-flex items-center gap-1 rounded-full border border-[#02474F]/15 bg-[#D4E8EA]/30 px-2.5 py-1 text-[11px] font-medium text-[#02474F]/70 hover:bg-[#D4E8EA]/50 transition-colors"
			>
				{current?.icon && <current.icon className="w-3 h-3" />}
				{current?.label}
				<IconChevronDown
					className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && (
				<div className="absolute right-0 top-full mt-1 z-50 bg-[#F2FEFF] rounded-lg border border-[#02474F]/10 shadow-lg py-1 min-w-[140px]">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setOpen(false);
							}}
							className={`w-full text-left px-3 py-2 text-xs hover:bg-[#D4E8EA]/40 transition-colors flex items-center gap-2 ${
								value === option.value
									? "text-[#0E808D] font-medium bg-[#0E808D]/5"
									: "text-[#02474F]"
							}`}
						>
							<option.icon className="w-3.5 h-3.5" />
							{option.label}
							{value === option.value && (
								<span className="ml-auto text-[#0E808D] text-[10px]">
									✓
								</span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
