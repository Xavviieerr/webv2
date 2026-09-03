export const PLACES_PAGE_SIZE = 12;
export const FALLBACK_PLACE_COUNT = 0;

export const PLACE_NAME_MAX_LENGTH = 200;
export const PLACE_DESCRIPTION_MAX_LENGTH = 5000;
export const PLACE_REVIEW_MAX_LENGTH = 2000;
export const PLACE_CLAIM_MAX_LENGTH = 1000;
export const PLACE_RESPONSE_MAX_LENGTH = 2000;

export const PLACE_TYPES = [
	{ value: "business", label: "Business" },
	{ value: "landmark", label: "Landmark" },
	{ value: "school", label: "School" },
	{ value: "hospital", label: "Hospital" },
	{ value: "church", label: "Church" },
	{ value: "government_office", label: "Government Office" },
	{ value: "historical_site", label: "Historical Site" },
	{ value: "cultural_institution", label: "Cultural Institution" },
	{ value: "community", label: "Community" },
	{ value: "village", label: "Village" },
	{ value: "city", label: "City" },
	{ value: "river", label: "River" },
	{ value: "park", label: "Park" },
	{ value: "mountain", label: "Mountain" },
	{ value: "beach", label: "Beach" },
	{ value: "island", label: "Island" },
	{ value: "other", label: "Other" },
] as const;

export const PLACE_SORT_OPTIONS = [
	{ value: "recent", label: "Most Recent" },
	{ value: "name", label: "Name A-Z" },
] as const;

export const PLACE_STATUS_OPTIONS = [
	{ value: "approved", label: "Approved" },
	{ value: "pending", label: "Pending" },
	{ value: "rejected", label: "Rejected" },
] as const;

export const PLACE_COLORS = {
	pageBg: "#F2FEFF",
	cardBg: "#D4E8EA",
	cardBgHover: "#D4E8EA/70",
	skeletonBg: "#8AA5A81A",
	primaryText: "#0D4D4D",
	secondaryText: "#6A6A6A",
	accent: "#0E808D",
	border: "#0D4D4D/10",
	inputBg: "#D4E8EA/30",
} as const;

export const PLACE_VIEW_MODES = {
	GRID: "grid",
	LIST: "list",
} as const;
