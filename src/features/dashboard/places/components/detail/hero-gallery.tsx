"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Star, CheckCircle, ImageIcon, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PlaceDetail } from "../../types";

interface HeroGalleryProps {
	place: PlaceDetail;
}

function formatStatus(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatSubmissionType(type: string): string {
	if (type === "admin") return "Added by admin";
	if (type === "user") return "Suggested by a user";
	return type;
}

function getStatusColors(status: string): string {
	switch (status) {
		case "approved":
			return "bg-green-100 text-green-700";
		case "pending":
			return "bg-yellow-100 text-yellow-700";
		case "rejected":
			return "bg-red-100 text-red-700";
		default:
			return "bg-[#D4E8EA] text-[#0D4D4D]";
	}
}

const MAX_THUMBNAILS = 6;

export function HeroGallery({ place }: HeroGalleryProps) {
	const router = useRouter();
	const bp = place.businessProfile;
	const loc = place.location;
	const rating = bp?.averageRating ? parseFloat(bp.averageRating) : 0;
	const reviewCount = bp?.reviewCount ?? 0;
	const isVerified = bp?.businessVerificationLevel === "verified";

	const images = place.images ?? [];
	const coverImage = place.coverImage || images[0] || null;
	const [activeImage, setActiveImage] = useState(coverImage);

	const visibleThumbnails = images.slice(0, MAX_THUMBNAILS);
	const remainingCount = images.length - MAX_THUMBNAILS;

	return (
		<div className="space-y-4">
			<button
				type="button"
				onClick={() => router.back()}
				className="inline-flex items-center gap-1.5 text-xs font-medium text-[#02474F]/50 hover:text-[#02474F] transition-colors self-start cursor-pointer"
			>
				<ArrowLeft className="w-3.5 h-3.5" />
				Back to Places
			</button>

			<div className="relative w-full aspect-video sm:aspect-[16/10] bg-[#D4E8EA] rounded-xl overflow-hidden flex items-center justify-center">
				{activeImage ? (
					<img src={activeImage} alt={place.name} className="w-full h-full object-cover" />
				) : (
					<div className="flex flex-col items-center gap-2 text-[#8AA5A8]">
						<ImageIcon className="w-12 h-12" />
						<span className="text-sm">No image available</span>
					</div>
				)}
			</div>

			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
					{visibleThumbnails.map((img, i) => (
						<button
							key={i}
							type="button"
							onClick={() => setActiveImage(img)}
							className={`shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
								activeImage === img
									? "border-[#02474F]"
									: "border-transparent hover:border-[#0E808D]"
							}`}
						>
							<img src={img} alt="" className="w-full h-full object-cover" />
						</button>
					))}
					{remainingCount > 0 && (
						<div className="shrink-0 w-[60px] h-[60px] rounded-lg bg-[#D4E8EA] flex items-center justify-center text-[#0D4D4D] text-xs font-medium">
							+{remainingCount}
						</div>
					)}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<div className="flex items-start gap-2">
					<h1 className="text-2xl sm:text-3xl font-semibold text-[#02474F] flex-1">
						{place.name}
					</h1>
					{isVerified && (
						<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0E808D]/10 text-[#0E808D] text-xs font-medium shrink-0">
							<CheckCircle className="w-3.5 h-3.5" />
							Verified
						</span>
					)}
					{place.status && place.status !== "approved" && (
						<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${getStatusColors(place.status)}`}>
							{formatStatus(place.status)}
						</span>
					)}
				</div>

				{place.submissionType && (
					<p className="text-[13px] text-[#02474F]/45">
						{formatSubmissionType(place.submissionType)}
					</p>
				)}

				{loc && (
					<p className="text-sm text-[#02474F]/60 flex items-center gap-1.5">
						<MapPin className="w-4 h-4 text-[#0E808D]" />
						{[loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
					</p>
				)}

				<div className="flex flex-wrap items-center gap-3">
					{bp && rating > 0 && (
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-0.5">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
									/>
								))}
							</div>
							<span className="text-sm font-medium text-[#0D4D4D]">{rating.toFixed(1)}</span>
							{reviewCount > 0 && (
								<span className="text-sm text-[#0D4D4D]/50">({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
							)}
						</div>
					)}
					{place.viewCount > 0 && (
						<span className="inline-flex items-center gap-1 text-[13px] text-[#02474F]/45">
							<Eye className="w-3.5 h-3.5" />
							{place.viewCount} view{place.viewCount !== 1 ? "s" : ""}
						</span>
					)}
				</div>

				{(place.tags ?? []).length > 0 && (
					<div className="flex flex-wrap gap-1.5 mt-1">
						{place.tags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center rounded-full bg-[#D4E8EA] px-2 py-0.5 text-[11px] font-medium text-[#02474F]/60"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
