export interface PlaceAuthor {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
}

export interface PlaceLocation {
	id: string;
	placeId: string;
	country: string;
	state: string;
	city: string;
	address: string;
	latitude: string;
	longitude: string;
	createdAt: string;
	updatedAt: string;
}

export interface PlaceOperatingHours {
	open?: string;
	close?: string;
	closed?: boolean;
}

export interface PlaceBusinessProfile {
	id: string;
	placeId: string;
	phoneNumber: string;
	email: string;
	website: string;
	category: string;
	openingHours: Record<string, PlaceOperatingHours>;
	logo: string;
	businessVerificationLevel: string;
	averageRating: string;
	reviewCount: number;
	ownerId: string | null;
	isClaimed: boolean;
	claimedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PlaceListItem {
	id: string;
	name: string;
	description: string;
	type: string;
	status: string;
	coverImage: string | null;
	images: string[];
	verificationStatus: string;
	tags: string[];
	viewCount: number;
	submissionType: string;
	suggestedById: string | null;
	createdById: string | null;
	createdBy: PlaceAuthor;
	location: PlaceLocation;
	businessProfile?: PlaceBusinessProfile;
	relatedPlaces: string[];
	rowVersion: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export type PlaceDetail = PlaceListItem;

export interface PlaceListResponse {
	data: {
		items: PlaceListItem[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	message: string;
}

export interface PlaceDetailResponse {
	data: PlaceDetail;
	message: string;
}

export interface PlaceReview {
	id: string;
	businessProfileId: string;
	userId: string;
	rating: number;
	comment: string;
	ownerResponse: string | null;
	ownerRespondedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PlaceClaim {
	id: string;
	businessProfile: { id: string; phoneNumber?: string; email?: string };
	user: { id: string; email: string; username: string };
	proofDocuments: string[] | null;
	note: string;
	status: "pending" | "approved" | "rejected";
	reviewedBy: string | null;
	rejectionReason: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PlaceListParams {
	page?: number;
	limit?: number;
	search?: string;
	type?: string;
	status?: string;
	sortBy?: string;
	sortDir?: "asc" | "desc";
}

export interface PlaceReviewParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortDir?: "asc" | "desc";
}

export type PlaceSortOption = "recent" | "name";

export type PlaceViewMode = "grid" | "list";

export interface PlaceStatsResponse {
	data: {
		total: number;
		approved: number;
		pending: number;
		rejected: number;
		businesses: number;
		claimed: number;
		pendingClaims: number;
	};
	message: string;
}

export interface PlaceCountResponse {
	data: number;
	message: string;
}

export interface SuggestPlaceInput {
	name: string;
	description: string;
	type: string;
	images?: string[];
	tags?: string[];
	location?: {
		city?: string;
		state?: string;
		country?: string;
		address?: string;
		latitude?: number;
		longitude?: number;
	};
}

export interface ClaimPlaceInput {
	note: string;
	proofDocuments?: string[];
}

export interface SubmitReviewInput {
	rating: number;
	comment: string;
}

export interface RespondToReviewInput {
	response: string;
}

export interface PlaceImageUploadResponse {
	thumbnail: string;
	small: string;
	medium: string;
	large: string;
	original: string;
}
