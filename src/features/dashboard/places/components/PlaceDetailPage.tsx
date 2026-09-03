"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { IconEdit, IconClock, IconAlertTriangle } from "@tabler/icons-react";
import { useGetPlaceByIdQuery } from "../api/placeEndpoints";
import { usePlaceOwnership } from "../hooks/usePlaceOwnership";
import { useUserClaimStatus } from "../hooks/useUserClaimStatus";
import { HeroGallery } from "./detail/hero-gallery";
import { InfoCard } from "./detail/info-card";
import { DescriptionSection } from "./detail/description-section";
import { PlaceMap } from "./detail/place-map";
import { ReviewsPanel } from "./detail/reviews-panel";
import { ClaimOwnershipModal } from "./claim/claim-ownership-modal";
import { EditBusinessModal } from "./edit/edit-business-modal";

interface PlaceDetailPageProps {
	params: Promise<{ id: string }>;
}

export function PlaceDetailPage({ params }: PlaceDetailPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const { data: place, isLoading, error, refetch } = useGetPlaceByIdQuery(id, {
		refetchOnMountOrArgChange: true,
	});
	const [showClaimModal, setShowClaimModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const { isOwner } = usePlaceOwnership(place);
	const { status: claimStatus, refetch: refetchClaims } = useUserClaimStatus(place?.businessProfile?.id);

	if (isLoading) {
		return (
			<div className="min-h-0 lg:h-[calc(100vh-var(--top-banners-height,65px))] flex flex-col w-full py-10 lg:px-20 md:px-10 px-4">
				<div className="max-w-5xl w-full mx-auto space-y-4">
					<div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="h-64 sm:h-80 rounded-xl animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="h-6 w-3/4 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
						</div>
						<div className="space-y-4">
							<div className="h-40 rounded-xl animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !place) {
		return (
			<div className="min-h-0 lg:h-[calc(100vh-var(--top-banners-height,65px))] flex flex-col items-center justify-center w-full py-10 lg:px-20 md:px-10 px-4 text-center">
				<h1 className="text-2xl font-semibold text-gray-900 mb-2">Place not found</h1>
				<p className="text-gray-600 mb-6">The place you&apos;re looking for doesn&apos;t exist or has been removed.</p>
				<button
					type="button"
					onClick={() => router.push("/dashboard/places")}
					className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 cursor-pointer"
				>
					Back to Places
				</button>
			</div>
		);
	}

	const isBusiness = place.type === "business";
	const loc = place.location;
	const averageRating = place.businessProfile?.averageRating ? parseFloat(place.businessProfile.averageRating) : 0;

	const renderClaimSection = () => {
		if (!isBusiness) return null;

		if (isOwner) {
			return (
				<button
					type="button"
					onClick={() => setShowEditModal(true)}
					className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0E808D]/30 bg-[#0E808D]/5 text-[#0E808D] text-sm font-medium hover:border-[#0E808D]/60 hover:bg-[#0E808D]/10 transition-all cursor-pointer"
				>
					<IconEdit className="w-4 h-4" />
					Edit Business Information
				</button>
			);
		}

		if (claimStatus === "pending") {
			return (
				<div className="w-full px-4 py-3 rounded-xl border border-yellow-300/50 bg-yellow-50 flex items-center gap-3">
					<IconClock className="w-5 h-5 text-yellow-600 shrink-0" />
					<div>
						<p className="text-sm font-medium text-yellow-800">Your claim is under review</p>
						<p className="text-xs text-yellow-600">We&apos;ll notify you once a decision is made.</p>
					</div>
				</div>
			);
		}

		if (claimStatus === "rejected") {
			return (
				<div className="w-full space-y-2">
					<div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3">
						<IconAlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
						<div>
							<p className="text-sm font-medium text-red-800">Your previous claim was denied</p>
							<p className="text-xs text-red-600">You can submit a new claim with updated information.</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setShowClaimModal(true)}
						className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#02474F]/30 text-[#02474F] text-sm font-medium hover:border-[#02474F]/60 hover:bg-[#D4E8EA]/50 transition-all cursor-pointer"
					>
						Submit new claim
					</button>
				</div>
			);
		}

		if (claimStatus === "approved") {
			return (
				<button
					type="button"
					onClick={() => setShowEditModal(true)}
					className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0E808D]/30 bg-[#0E808D]/5 text-[#0E808D] text-sm font-medium hover:border-[#0E808D]/60 hover:bg-[#0E808D]/10 transition-all cursor-pointer"
				>
					<IconEdit className="w-4 h-4" />
					Edit Business Information
				</button>
			);
		}

		if (place.businessProfile?.isClaimed) {
			return null;
		}

		return (
			<button
				type="button"
				onClick={() => setShowClaimModal(true)}
				className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#02474F]/30 text-[#02474F] text-sm font-medium hover:border-[#02474F]/60 hover:bg-[#D4E8EA]/50 transition-all cursor-pointer"
			>
				Are you the owner? Claim this place
			</button>
		);
	};

	return (
		<div className="min-h-0 lg:h-[calc(100vh-var(--top-banners-height,65px))] flex flex-col w-full py-10 lg:px-20 md:px-10 px-4">
			<div className="max-w-5xl w-full mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<HeroGallery place={place} />
						{isBusiness && (
							<DescriptionSection description={place.description} />
						)}
						{isBusiness && loc?.latitude && loc?.longitude && (
							<PlaceMap
								latitude={loc.latitude}
								longitude={loc.longitude}
								name={place.name}
							/>
						)}
					</div>

					<div className="space-y-6">
						<InfoCard place={place} />

						{!isBusiness && (
							<DescriptionSection description={place.description} />
						)}

						{renderClaimSection()}

						{isBusiness && (
							<ReviewsPanel
								placeId={place.id}
								isBusiness={isBusiness}
								averageRating={averageRating}
								place={place}
							/>
						)}

						{!isBusiness && loc?.latitude && loc?.longitude && (
							<PlaceMap
								latitude={loc.latitude}
								longitude={loc.longitude}
								name={place.name}
							/>
						)}
					</div>
				</div>
			</div>

			{isBusiness && (
				<ClaimOwnershipModal
					open={showClaimModal}
					onClose={() => setShowClaimModal(false)}
					placeId={place.id}
					placeName={place.name}
					onClaimSubmitted={() => refetchClaims()}
				/>
			)}

		{isBusiness && (
			<EditBusinessModal
				open={showEditModal}
				onClose={() => setShowEditModal(false)}
				place={place}
				onSaved={() => refetch()}
			/>
		)}
		</div>
	);
}
