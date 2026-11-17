import type {
	ContributorScope,
	ContributorScopeRecord,
	ContributorStatus,
} from "../types";

const KNOWN_STATUSES: ContributorStatus[] = [
	"pending",
	"approved",
	"rejected",
	"suspended",
];

export function isContributorStatus(
	status: string,
): status is ContributorStatus {
	return (KNOWN_STATUSES as string[]).includes(status);
}

export type ScopeStatusMap = Partial<
	Record<ContributorScope, ContributorScopeRecord>
>;

/**
 * The API can return unknown scopes or malformed records. Build a lookup that
 * keeps only the first record per known scope so the UI can render safely.
 */
export function buildScopeStatusMap(
	records: ContributorScopeRecord[] | undefined,
): ScopeStatusMap {
	const map: ScopeStatusMap = {};
	if (!records) return map;

	for (const record of records) {
		if (!record?.scope) continue;
		const scope = record.scope as ContributorScope;
		if (!(scope in map)) {
			map[scope] = record;
		}
	}

	return map;
}

export function getStatusLabelKey(
	status: ContributorStatus | string | undefined,
): string {
	switch (status) {
		case "pending":
			return "statusPending";
		case "approved":
			return "statusApproved";
		case "rejected":
			return "statusRejected";
		case "suspended":
			return "statusSuspended";
		default:
			return "statusNotApplied";
	}
}

export function getStatusTone(
	status: ContributorStatus | string | undefined,
): { badge: string; dot: string } {
	switch (status) {
		case "approved":
			return {
				badge: "bg-[#E8FDD0] text-[#2F6B00]",
				dot: "bg-[#58CC02]",
			};
		case "pending":
			return {
				badge: "bg-[#FFF3D6] text-[#8A5A00]",
				dot: "bg-[#E8A400]",
			};
		case "rejected":
			return {
				badge: "bg-[#FDE8E8] text-[#A61B1B]",
				dot: "bg-[#E53E3E]",
			};
		case "suspended":
			return {
				badge: "bg-gray-200 text-gray-700",
				dot: "bg-gray-500",
			};
		default:
			return {
				badge: "bg-white text-[#0D4D4D] border border-[#0D4D4D]/20",
				dot: "bg-[#0D4D4D]/30",
			};
	}
}
