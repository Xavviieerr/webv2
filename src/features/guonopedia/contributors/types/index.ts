export const CONTRIBUTOR_SCOPES = [
	"lyrics",
	"customs",
	"folktales",
	"dictionary",
	"name",
	"figure",
	"place",
	"culture",
	"community",
	"music",
	"other",
] as const;

export type ContributorScope = (typeof CONTRIBUTOR_SCOPES)[number];

export type ContributorStatus =
	| "pending"
	| "approved"
	| "rejected"
	| "suspended";

export interface ContributorScopeRecord {
	id: string;
	scope: ContributorScope | string;
	status: ContributorStatus | string;
	expertise?: string | null;
	submissionCount?: number;
	approvedCount?: number;
	approvedBy?: unknown;
	rejectedBy?: unknown;
	suspendedBy?: unknown;
	rejectionReason?: string | null;
	suspensionReason?: string | null;
}

export interface ContributorApplication extends ContributorScopeRecord {
	userId: string;
	applicationNote?: string | null;
	approvedById?: string | null;
	approvedAt?: string | null;
	rejectedById?: string | null;
	suspendedById?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface SkippedScope {
	scope: string;
	reason: string;
}

export interface ApplyContributorPayload {
	scopes: ContributorScope[];
	applicationNote?: string;
	expertise?: string;
}

export interface ApplyContributorResponse {
	data: {
		applied: ContributorApplication[];
		skipped: SkippedScope[];
	};
	message: string;
}

export interface ContributorScopesResponse {
	data: ContributorScopeRecord[];
	message: string;
}
