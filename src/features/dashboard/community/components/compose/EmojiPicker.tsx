"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconMoodSmile } from "@tabler/icons-react";
import { QUICK_EMOJIS } from "../../constants";

interface EmojiPickerProps {
	onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
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

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="p-1.5 rounded-lg text-[#02474F]/50 hover:text-[#0E808D] hover:bg-[#0E808D]/5 transition-colors"
				title="Emoji"
			>
				<IconMoodSmile className="w-[18px] h-[18px]" />
			</button>
			{open && (
				<div className="absolute left-0 bottom-full mb-2 z-50 bg-[#F2FEFF] rounded-xl border border-[#02474F]/10 shadow-lg p-3 w-[264px]">
					<div className="grid grid-cols-6 gap-1">
						{QUICK_EMOJIS.map((emoji) => (
							<button
								key={emoji}
								type="button"
								onClick={() => {
									onSelect(emoji);
									setOpen(false);
								}}
								className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#D4E8EA]/50 transition-colors text-lg"
							>
								{emoji}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
