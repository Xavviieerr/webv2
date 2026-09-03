"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useGetPlacesQuery } from "@/features/dashboard/places/api/placeEndpoints";

const PLACE_CARDS_PER_PAGE = 3;

export function RandomPlaceCard() {
	const { data: placesData, isLoading } = useGetPlacesQuery({
		status: "approved",
		page: 1,
		limit: PLACE_CARDS_PER_PAGE,
		sortBy: "createdAt",
		sortDir: "desc",
	});

	const randomPlace = useMemo(() => {
		const items = placesData?.items;
		if (!items || items.length === 0) return null;
		const idx = Math.floor(Math.random() * items.length);
		return items[idx];
	}, [placesData?.items]);

	if (isLoading) {
		return (
			<div className="bg-[#D4E8EA]/50 rounded-xl p-4 border border-[#02474F]/10">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-8 h-8 rounded-lg bg-[#0E808D]/10 animate-pulse" />
					<div className="h-3 rounded w-20 animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
				</div>
				<div className="space-y-2">
					<div className="h-3 rounded w-full animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="h-3 rounded w-3/4 animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
				</div>
			</div>
		);
	}

	if (!randomPlace) {
		return (
			<div className="bg-[#D4E8EA]/50 rounded-xl p-4 border border-[#02474F]/10">
				<p className="text-sm text-[#02474F]/50">No places yet.</p>
			</div>
		);
	}

	const coverImage = randomPlace.coverImage || randomPlace.images?.[0] || null;

	return (
		<div className="bg-[#D4E8EA]/50 rounded-xl overflow-hidden border border-[#02474F]/10 group">
			{coverImage ? (
				<div className="relative h-32 overflow-hidden">
					<img
						src={coverImage}
						alt={randomPlace.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
				</div>
			) : (
				<div className="relative h-32 bg-[#0E808D]/5 flex items-center justify-center">
					<MapPin className="w-10 h-10 text-[#0E808D]/30" />
				</div>
			)}
			<div className="p-3">
				<p className="text-[11px] font-medium uppercase tracking-wide text-[#0E808D] mb-1">
					{randomPlace.type}
				</p>
				<Link href={`/dashboard/places/${randomPlace.id}`}>
					<h3 className="text-sm font-semibold text-[#0D4D4D] group-hover:text-[#0E808D] transition-colors line-clamp-1">
						{randomPlace.name}
					</h3>
				</Link>
				{randomPlace.location && (
					<p className="text-xs text-[#02474F]/50 mt-1 line-clamp-1">
						{randomPlace.location.city || randomPlace.location.state || randomPlace.location.country || "Location"}
					</p>
				)}
			</div>
		</div>
	);
}
