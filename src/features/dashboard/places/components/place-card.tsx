"use client";

import { useRouter } from "next/navigation";
import {
	Star,
	MapPin,
	CheckCircle,
	ImageIcon,
	ChevronRight,
} from "lucide-react";
import type { PlaceListItem, PlaceViewMode } from "../types";

interface PlaceCardProps {
	place: PlaceListItem;
	viewMode: PlaceViewMode;
}

function formatType(type: string): string {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatVerificationLevel(level: string): string {
	switch (level) {
		case "verified":
			return "Verified";
		case "partial":
			return "Partially Verified";
		default:
			return "";
	}
}

export function PlaceCard({ place, viewMode }: PlaceCardProps) {
	const router = useRouter();
	const bp = place.businessProfile;
	const loc = place.location;

	const rating = bp?.averageRating ? parseFloat(bp.averageRating) : 0;
	const reviewCount = bp?.reviewCount ?? 0;
	const isVerified = bp?.businessVerificationLevel === "verified";
	const verificationLabel = formatVerificationLevel(
		bp?.businessVerificationLevel ?? "none",
	);

	const handleClick = () => {
		router.push(`/dashboard/places/${place.id}`);
	};

	const thumbnail = place.coverImage || place.images?.[0] || null;

	if (viewMode === "list") {
		return (
			<div
				onClick={handleClick}
				className="group flex gap-4 p-5 bg-[#D4E8EA]/70 rounded-2xl border border-[#02474F]/10 hover:border-[#0E808D]/50 hover:shadow-md transition-all duration-300 cursor-pointer"
			>
				<div className="w-24 h-24 bg-[#D4E8EA] rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
					{thumbnail ? (
						<img
							src={thumbnail}
							alt={place.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<ImageIcon className="w-8 h-8 text-[#8AA5A8]" />
					)}
				</div>
				<div className="flex-1 flex flex-col min-w-0">
					<div className="flex items-start gap-2 mb-1">
						<h3 className="text-base sm:text-lg font-semibold text-[#02474F] truncate group-hover:text-[#0E808D] transition-colors">
							{place.name}
						</h3>
						{isVerified && (
							<CheckCircle className="w-4 h-4 text-[#0E808D] shrink-0 mt-0.5" />
						)}
					</div>
					<p className="text-[13px] text-[#0D4D4D]/60 line-clamp-2 mb-2">
						{place.description}
					</p>
					<div className="flex flex-wrap items-center gap-2 mt-auto">
						<span className="inline-flex items-center rounded-xl border border-dashed border-[#0E808D]/30 bg-[#0E808D]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#0E808D]">
							{formatType(place.type)}
						</span>
						{loc?.city && loc?.state && (
							<span className="inline-flex items-center gap-1 text-[12px] text-[#0D4D4D]/50">
								<MapPin size={11} />
								{loc.city}, {loc.state}
							</span>
						)}
						{bp && rating > 0 && (
							<span className="inline-flex items-center gap-1 text-[12px] text-[#0D4D4D]/50">
								<Star size={11} className="fill-yellow-400 text-yellow-400" />
								{rating.toFixed(1)}
								{reviewCount > 0 && <span>({reviewCount})</span>}
							</span>
						)}
						{verificationLabel && (
							<span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0E808D]">
								{verificationLabel}
							</span>
						)}
					</div>
				</div>
				<ChevronRight className="w-4 h-4 text-[#0D4D4D]/20 group-hover:text-[#0E808D] shrink-0 mt-1 transition-colors" />
			</div>
		);
	}

	return (
		<div
			onClick={handleClick}
			className="group flex flex-col p-5 bg-[#D4E8EA]/70 rounded-2xl border border-[#02474F]/10 hover:border-[#0E808D]/50 hover:shadow-md transition-all duration-300 cursor-pointer"
		>
			{thumbnail && (
				<div className="w-full h-36 bg-[#D4E8EA] rounded-xl mb-3 overflow-hidden">
					<img
						src={thumbnail}
						alt={place.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				</div>
			)}
			<div className="flex items-start gap-2 mb-1">
				<h3 className="text-lg font-semibold text-[#02474F] flex-1 min-w-0 truncate group-hover:text-[#0E808D] transition-colors">
					{place.name}
				</h3>
				{isVerified && (
					<CheckCircle className="w-4 h-4 text-[#0E808D] shrink-0 mt-1" />
				)}
			</div>
			<p className="text-[13px] text-[#0D4D4D]/60 line-clamp-2 mb-3">
				{place.description}
			</p>
			<div className="flex flex-wrap items-center gap-2 mt-auto">
				<span className="inline-flex items-center rounded-xl border border-dashed border-[#0E808D]/30 bg-[#0E808D]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#0E808D]">
					{formatType(place.type)}
				</span>
				{loc?.city && loc?.state && (
					<span className="inline-flex items-center gap-1 text-[12px] text-[#0D4D4D]/50">
						<MapPin size={11} />
						{loc.city}, {loc.state}
					</span>
				)}
				{bp && rating > 0 && (
					<span className="inline-flex items-center gap-1 text-[12px] text-[#0D4D4D]/50">
						<Star size={11} className="fill-yellow-400 text-yellow-400" />
						{rating.toFixed(1)}
					</span>
				)}
			</div>
		{(place.tags ?? []).length > 0 && (
			<div className="flex items-center mt-3 pt-3 border-t border-[#02474F]/5">
				<span className="inline-flex items-center rounded-full bg-[#D4E8EA]/50 px-2 py-0.5 text-[11px] font-medium text-[#0D4D4D]/50 truncate max-w-[120px]">
					{place.tags.slice(0, 2).join(", ")}
				</span>
			</div>
		)}
		</div>
	);
}
