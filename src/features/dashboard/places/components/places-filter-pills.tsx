"use client";

import { X } from "lucide-react";
import { usePlaceFiltersStore } from "../store/placeFiltersStore";
import { PLACE_TYPES, PLACE_SORT_OPTIONS } from "../constants";

export function PlacesFilterPills() {
	const { search, type, sortBy, setSearch, setType, setSortBy, resetFilters } =
		usePlaceFiltersStore();

	const pills: Array<{ label: string; onRemove: () => void }> = [];

	if (search) {
		pills.push({ label: `Search: "${search}"`, onRemove: () => setSearch("") });
	}
	if (type) {
		const t = PLACE_TYPES.find((pt) => pt.value === type);
		pills.push({ label: t?.label ?? type, onRemove: () => setType("") });
	}
	if (sortBy !== "recent") {
		const sort = PLACE_SORT_OPTIONS.find((o) => o.value === sortBy);
		pills.push({ label: sort?.label ?? sortBy, onRemove: () => setSortBy("recent") });
	}

	if (pills.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2 mb-4">
			{pills.map((pill) => (
				<span
					key={pill.label}
					className="inline-flex items-center gap-1.5 rounded-full border border-[#0E808D]/30 bg-[#0E808D]/10 px-2.5 py-1 text-xs font-medium text-[#0E808D]"
				>
					{pill.label}
					<button
						type="button"
						onClick={pill.onRemove}
						className="p-0.5 rounded-full hover:bg-[#0E808D]/20 transition-colors cursor-pointer"
					>
						<X size={12} />
					</button>
				</span>
			))}
			<button
				type="button"
				onClick={resetFilters}
				className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors underline underline-offset-2 cursor-pointer"
			>
				Clear all
			</button>
		</div>
	);
}
