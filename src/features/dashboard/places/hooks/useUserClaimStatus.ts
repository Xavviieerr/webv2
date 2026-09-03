import { useMemo } from "react";
import { useAppSelector } from "@/types/hooks";
import { useGetPendingClaimsQuery } from "../api/placeEndpoints";
import type { PlaceClaim } from "../types";

export type ClaimStatus = "none" | "pending" | "rejected" | "approved";

export function useUserClaimStatus(businessProfileId: string | undefined) {
	const user = useAppSelector((state) => state.auth.user);
	const { data, isLoading, refetch } = useGetPendingClaimsQuery({ limit: 100 }, { refetchOnMountOrArgChange: true });

	const claim = useMemo(() => {
		if (!user || !data?.items || !businessProfileId) return undefined;
		return data.items.find(
			(c: PlaceClaim) =>
				c.user?.id === user.id && c.businessProfile?.id === businessProfileId,
		);
	}, [data, user, businessProfileId]);

	const status: ClaimStatus = useMemo(() => {
		if (!claim) return "none";
		return claim.status;
	}, [claim]);

	return { status, claim, isLoading, refetch };
}
