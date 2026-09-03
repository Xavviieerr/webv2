"use client";

import { ExternalLink, Phone, Mail, Globe, MapPin } from "lucide-react";
import type { PlaceListItem } from "../../types";

interface InfoCardProps {
	place: PlaceListItem;
}

function formatDay(day: string): string {
	return day.charAt(0).toUpperCase() + day.slice(1);
}

export function InfoCard({ place }: InfoCardProps) {
	const bp = place.businessProfile;
	const loc = place.location;

	const hasLocation = !!loc;
	const hasContact = !!(bp?.phoneNumber || bp?.email || bp?.website);
	const hasHours = !!bp?.openingHours && Object.keys(bp.openingHours).length > 0;
	const hasCategory = !!bp?.category;

	const sectionCount = [hasLocation, hasContact, hasHours, hasCategory].filter(Boolean).length;

	return (
		<div className="p-5 sm:p-6">
			<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D] mb-4">Information</h2>

			<div className="space-y-0 divide-y divide-[#02474F]/5">
				{hasLocation && (
					<div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
						<MapPin className="w-4 h-4 text-[#0E808D] mt-0.5 shrink-0" />
						<div className="min-w-0">
							<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50 mb-1">Location</p>
							<p className="text-sm text-[#0D4D4D]/70 leading-relaxed">
								{[loc.address, loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
							</p>
						</div>
					</div>
				)}

				{hasContact && (
					<div className="py-4">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50 mb-2">Contact</p>
						<div className="space-y-1.5">
							{bp.phoneNumber && (
								<div className="flex items-center gap-2 text-sm text-[#0D4D4D]/70">
									<Phone className="w-3.5 h-3.5 text-[#0E808D] shrink-0" />
									{bp.phoneNumber}
								</div>
							)}
							{bp.email && (
								<div className="flex items-center gap-2 text-sm text-[#0D4D4D]/70">
									<Mail className="w-3.5 h-3.5 text-[#0E808D] shrink-0" />
									{bp.email}
								</div>
							)}
							{bp.website && (
								<a
									href={bp.website}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-[#0E808D] hover:underline"
								>
									<Globe className="w-3.5 h-3.5 shrink-0" />
									{bp.website.replace(/^https?:\/\//, "")}
									<ExternalLink className="w-3 h-3 shrink-0" />
								</a>
							)}
						</div>
					</div>
				)}

				{hasHours && (
					<div className="py-4">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50 mb-2">Opening Hours</p>
						<div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
							{Object.entries(bp.openingHours).map(([day, hours]) => (
								<div key={day} className="flex items-center justify-between text-sm">
									<span className="text-[#0D4D4D]/50">{formatDay(day)}</span>
									<span className="text-[#0D4D4D]/70 font-medium">
										{hours.closed ? "Closed" : hours.open && hours.close ? `${hours.open} – ${hours.close}` : "—"}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{hasCategory && (
					<div className="py-4 last:pb-0">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0D4D4D]/50 mb-1.5">Category</p>
						<span className="inline-flex items-center rounded-xl border border-dashed border-[#0E808D]/30 bg-[#0E808D]/10 px-2.5 py-1 text-[12px] font-medium text-[#0E808D]">
							{bp.category.charAt(0).toUpperCase() + bp.category.slice(1).replace(/([A-Z])/g, " $1")}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
