import { useAppSelector } from "@/types/hooks";
import type { PlaceListItem } from "../types";

export function usePlaceOwnership(place: PlaceListItem | undefined) {
	const user = useAppSelector((state) => state.auth.user);
	const isOwner =
		!!user &&
		!!place?.businessProfile?.isClaimed &&
		user.id === place.businessProfile.ownerId;
	return { isOwner, user };
}
