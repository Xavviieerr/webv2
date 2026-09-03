"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	IconLayoutGrid,
	IconList,
	IconPlus,
	IconChevronDown,
} from "@tabler/icons-react";
import { usePlaceFiltersStore } from "../store/placeFiltersStore";
import { PLACE_SORT_OPTIONS, PLACE_TYPES } from "../constants";
import type { PlaceSortOption } from "../types";

interface PlacesFilterBarProps {
	onSuggestPlace: () => void;
}

interface CustomSelectProps {
	label: string;
	value: string;
	options: Array<{ value: string; label: string }>;
	onChange: (value: string) => void;
}

function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = options.find((o) => o.value === value);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = useCallback(
		(val: string) => {
			onChange(val);
			setOpen(false);
		},
		[onChange],
	);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="h-10 px-3 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-sm text-[#0D4D4D] outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors cursor-pointer flex items-center gap-2 min-w-[120px]"
			>
				<span className="truncate">{selected?.label ?? label}</span>
				<IconChevronDown
					size={14}
					className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute top-full left-0 mt-1 w-full min-w-[160px] rounded-lg border border-[#02474F]/10 bg-[#F2FEFF] shadow-lg z-50 overflow-hidden">
					<div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
						{options.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => handleSelect(opt.value)}
								className={`w-full text-left px-3 py-2 text-sm hover:bg-[#D4E8EA]/40 transition-colors cursor-pointer ${
									opt.value === value
										? "text-[#0E808D] font-medium bg-[#0E808D]/5"
										: "text-[#0D4D4D]"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export function PlacesFilterBar({ onSuggestPlace }: PlacesFilterBarProps) {
	const { type, sortBy, viewMode, setType, setSortBy, setViewMode } =
		usePlaceFiltersStore();

	const typeOptions = [{ value: "", label: "All Types" }, ...PLACE_TYPES];
	const sortOptions = [...PLACE_SORT_OPTIONS];

	return (
		<div className="flex flex-wrap items-center gap-2 w-full">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setViewMode("grid")}
					className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
						viewMode === "grid"
							? "bg-[#02474F] text-white border-[#02474F]"
							: "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"
					}`}
				>
					<IconLayoutGrid size={16} />
				</button>
				<button
					type="button"
					onClick={() => setViewMode("list")}
					className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
						viewMode === "list"
							? "bg-[#02474F] text-white border-[#02474F]"
							: "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"
					}`}
				>
					<IconList size={16} />
				</button>
			</div>

			<div className="h-6 w-px bg-[#0D4D4D]/10 max-md:hidden" />

			<CustomSelect
				label="All Types"
				value={type}
				options={typeOptions}
				onChange={setType}
			/>

			<CustomSelect
				label="Sort By"
				value={sortBy}
				options={sortOptions}
				onChange={(val) => setSortBy(val as PlaceSortOption)}
			/>

			<div className="flex-1" />

			<button
				type="button"
				onClick={onSuggestPlace}
				className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#02474F] text-sm font-medium text-white hover:bg-[#0E808D]/90 transition-colors cursor-pointer"
			>
				<IconPlus className="w-4 h-4" />
				<span className="hidden sm:inline">Suggest Place</span>
			</button>
		</div>
	);
}
