"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/types/hooks";
import { useGetContributorScopesQuery } from "../api/contributorEndpoints";
import {
	getScopeDefinition,
	isContributorScope,
	isScopeContributionAvailable,
} from "../constants/scopes";
import type { ContributorScopeRecord } from "../types";

export const CONTRIBUTOR_APPLY_PATH = "/guonopedia/contribute/apply";
export const CONTRIBUTOR_HUB_PATH = "/guonopedia/contribute";

const EMPTY_RECORDS: ContributorScopeRecord[] = [];

function getWorkspaceHref(record: ContributorScopeRecord): string | null {
	const scope = String(record.scope);
	if (record.status !== "approved") return null;
	if (!isContributorScope(scope)) return null;

	const definition = getScopeDefinition(scope);
	return isScopeContributionAvailable(definition)
		? (definition.workspaceHref ?? null)
		: null;
}

/**
 * Single source of truth for "has this user applied before?" so the landing
 * page, hub and scope pages all agree on which CTA to show.
 */
export function useContributorAccess() {
	const user = useAppSelector((state) => state.auth.user);

	const query = useGetContributorScopesQuery(user?.id ?? "", {
		skip: !user?.id,
	});

	const records = query.data ?? EMPTY_RECORDS;
	const hasApplication = Boolean(user) && records.length > 0;

	const firstApprovedWorkspace = useMemo(() => {
		for (const record of records) {
			const href = getWorkspaceHref(record);
			if (href) return href;
		}
		return null;
	}, [records]);

	const applyHref = user
		? CONTRIBUTOR_APPLY_PATH
		: `/signin?next=${encodeURIComponent(CONTRIBUTOR_APPLY_PATH)}`;

	return {
		user,
		records,
		hasApplication,
		firstApprovedWorkspace,
		applyHref,
		hubHref: CONTRIBUTOR_HUB_PATH,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		refetch: query.refetch,
	};
}
