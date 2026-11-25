import type { ElementType } from "react";
import {
	IconBook,
	IconBook2,
	IconBuildingCommunity,
	IconDots,
	IconMapPin,
	IconMicrophone2,
	IconMusic,
	IconPalette,
	IconStar,
	IconUser,
	IconWorld,
} from "@tabler/icons-react";
import { CONTRIBUTOR_SCOPES, type ContributorScope } from "../types";

export interface ScopeDefinition {
	value: ContributorScope;
	labelKey: string;
	descriptionKey: string;
	icon: ElementType;
	color: string;
	workspaceHref?: string;
	/**
	 * Whether the public Guọnọpedia page for this scope is live. This is
	 * independent from contributor availability.
	 */
	available: boolean;
	/**
	 * Whether contributors can work on this scope. Falls back to `available`
	 * when omitted so older definitions keep working.
	 */
	contributionAvailable?: boolean;
}

export const SCOPE_DEFINITIONS: ScopeDefinition[] = [
	{
		value: "dictionary",
		labelKey: "urhoboDictionary",
		descriptionKey: "dictionaryDescription",
		icon: IconBook,
		color: "#59431B",
		workspaceHref: "/dashboard/dictionary",
		available: true,
		contributionAvailable: true,
	},
	{
		value: "name",
		labelKey: "names",
		descriptionKey: "namesDescription",
		icon: IconUser,
		color: "#FF9448",
		workspaceHref: "/dashboard/names",
		available: true,
		contributionAvailable: true,
	},
	{
		value: "figure",
		labelKey: "notableFigures",
		descriptionKey: "notableUrhoboLeaders",
		icon: IconStar,
		color: "#0D4D4D",
		workspaceHref: "/dashboard/figures",
		available: true,
		contributionAvailable: true,
	},
	{
		value: "place",
		labelKey: "places",
		descriptionKey: "placesDescription",
		icon: IconMapPin,
		color: "#9748FF",
		workspaceHref: "/dashboard/places",
		available: true,
		contributionAvailable: true,
	},
	{
		value: "customs",
		labelKey: "customAndTradition",
		descriptionKey: "customAndTraditionDescription",
		icon: IconPalette,
		color: "#E85D75",
		available: false,
	},
	{
		value: "folktales",
		labelKey: "folktales",
		descriptionKey: "folktalesDescription",
		icon: IconBook2,
		color: "#2E7D32",
		workspaceHref: "/guonopedia/contribute/folktales",
		available: false,
		contributionAvailable: true,
	},
	{
		value: "lyrics",
		labelKey: "lyrics",
		descriptionKey: "lyricsDescription",
		icon: IconMicrophone2,
		color: "#B84300",
		available: false,
	},
	{
		value: "music",
		labelKey: "music",
		descriptionKey: "musicDescription",
		icon: IconMusic,
		color: "#241624",
		available: false,
	},
	{
		value: "culture",
		labelKey: "culture",
		descriptionKey: "cultureDescription",
		icon: IconWorld,
		color: "#1565C0",
		available: false,
	},
	{
		value: "community",
		labelKey: "community",
		descriptionKey: "communityDescription",
		icon: IconBuildingCommunity,
		color: "#165E5B",
		workspaceHref: "/dashboard/community",
		available: true,
		contributionAvailable: true,
	},
	{
		value: "other",
		labelKey: "other",
		descriptionKey: "otherDescription",
		icon: IconDots,
		color: "#7A5A44",
		available: false,
	},
];

export const SCOPE_DEFINITION_MAP = new Map<ContributorScope, ScopeDefinition>(
	SCOPE_DEFINITIONS.map((definition) => [definition.value, definition]),
);

export function isContributorScope(value: string): value is ContributorScope {
	return (CONTRIBUTOR_SCOPES as readonly string[]).includes(value);
}

export function isScopeContributionAvailable(
	definition: ScopeDefinition,
): boolean {
	return definition.contributionAvailable ?? definition.available;
}

export function getScopeDefinition(
	scope: ContributorScope,
): ScopeDefinition {
	return (
		SCOPE_DEFINITION_MAP.get(scope) ?? {
			value: "other",
			labelKey: "other",
			descriptionKey: "otherDescription",
			icon: IconDots,
			color: "#7A5A44",
			available: false,
		}
	);
}
