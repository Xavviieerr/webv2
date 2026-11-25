export const FOLKTALE_TYPES = [
	"trickster",
	"origin_myth",
	"animal_fable",
	"moral_tale",
	"legend",
	"supernatural",
	"historical",
	"adventure",
	"comedy",
	"romance",
	"mystery",
	"tragedy",
	"fairy_tale",
	"other",
] as const;

export type FolktaleType = (typeof FOLKTALE_TYPES)[number];

export const FOLKTALE_STATUSES = [
	"draft",
	"submitted",
	"pending",
	"approved",
	"rejected",
	"archived",
] as const;

export type FolktaleStatus = (typeof FOLKTALE_STATUSES)[number];

export interface FolktaleListItem {
	id: string;
	title: string;
	summary: string;
	coverImage?: string | null;
	type: FolktaleType | string;
	readingTimeMinutes: number;
	status: FolktaleStatus | string;
	rejectionReason?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface FolktaleListData {
	items: FolktaleListItem[];
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
	page: number;
	limit: number;
}

export interface FolktaleListResponse {
	data: FolktaleListData;
	message?: string;
}

export interface FolktaleListParams {
	page?: number;
	limit?: number;
	type?: string;
	status?: string;
}

export interface FolktaleIllustration {
	id?: string;
	anchorKey: string;
	imageUrl?: string | null;
	altText?: string | null;
	caption?: string | null;
	illustrator?: string | null;
	order: number;
}

export interface FolktaleCharacter {
	id?: string;
	name: string;
	localName?: string | null;
	role?: string | null;
	description?: string | null;
	image?: string | null;
	order: number;
}

export interface FolktaleGlossaryEntry {
	id?: string;
	term: string;
	pronunciation?: string | null;
	order: number;
}

export interface FolktaleDetail extends FolktaleListItem {
	localTitle?: string | null;
	body: string;
	moral?: string | null;
	region?: string | null;
	tags?: string[];
	storytellerName?: string | null;
	storytellerBio?: string | null;
	sourceNote?: string | null;
	collectedYear?: string | null;
	audioUrl?: string | null;
	audioDurationSeconds?: number | null;
	narratorName?: string | null;
	narratorBio?: string | null;
	narratorImage?: string | null;
	viewCount?: number | null;
	playCount?: number | null;
	submittedById?: string | null;
	approvedById?: string | null;
	approvedAt?: string | null;
	rejectedById?: string | null;
	illustrations?: FolktaleIllustration[];
	characters?: FolktaleCharacter[];
	glossary?: FolktaleGlossaryEntry[];
	translations?: unknown;
	rowVersion?: number;
}

export interface FolktaleDetailResponse {
	data: FolktaleDetail;
	message?: string;
}

export interface CreateFolktalePayload {
	title: string;
	localTitle?: string;
	summary: string;
	body: string;
	type: FolktaleType;
	moral?: string;
	region?: string;
	tags?: string[];
	storytellerName?: string;
	storytellerBio?: string;
	sourceNote?: string;
	collectedYear?: string;
	narratorName?: string;
	narratorBio?: string;
	illustrations?: Array<{
		anchorKey: string;
		altText?: string;
		caption?: string;
		illustrator?: string;
		order: number;
	}>;
	characters?: Array<{
		name: string;
		localName?: string;
		role?: string;
		description?: string;
		order: number;
	}>;
	glossary?: Array<{
		term: string;
		pronunciation?: string;
		order: number;
	}>;
}

export interface CreateFolktaleResponse {
	data: FolktaleDetail;
	message?: string;
}
