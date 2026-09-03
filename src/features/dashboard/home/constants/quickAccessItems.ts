import {
	IconBook,
	IconUsers,
	IconStar,
	IconMapPin,
	IconFileText,
	IconMusic,
	IconRun,
} from "@tabler/icons-react";
import type { ElementType } from "react";

export interface QuickAccessItem {
	titleKey: string;
	descriptionKey: string;
	countKey: string;
	icon: ElementType;
	iconBg: string;
	href?: string;
	isReady: boolean;
}

export const quickAccessItems: QuickAccessItem[] = [
	{
		titleKey: "community",
		descriptionKey: "communityDescription",
		countKey: "communityCount",
		icon: IconStar,
		iconBg: "#0D4D4D",
		href: "/dashboard/community",
		isReady: true,
	},
	{
		titleKey: "guonopedia",
		descriptionKey: "guonopediaDescription",
		countKey: "guonopediaCount",
		icon: IconBook,
		iconBg: "#59431B",
		href: "/guonopedia",
		isReady: true,
	},
	{
		titleKey: "urhoboMusic",
		descriptionKey: "instrumentsRhythmsCompositions",
		countKey: "recordingsCount",
		icon: IconMusic,
		iconBg: "#241624",
		href: "/dashboard/music",
		isReady: true,
	},
	{
		titleKey: "sports",
		descriptionKey: "sportsDescriptionDash",
		countKey: "sportsCount",
		icon: IconRun,
		iconBg: "#59431B",
		href: "/dashboard/sports",
		isReady: true,
	},
	{
		titleKey: "culturalPractices",
		descriptionKey: "culturalPracticesDescription",
		countKey: "culturalPracticesCount",
		icon: IconUsers,
		iconBg: "#FF9448",
		isReady: false,
	},
	{
		titleKey: "urhoboNames",
		descriptionKey: "urhoboNamesDescription",
		countKey: "urhoboNamesCount",
		icon: IconUsers,
		iconBg: "#4880FF",
		isReady: false,
	},
	{
		titleKey: "historicalFeatures",
		descriptionKey: "notableUrhoboLeaders",
		countKey: "profilesCount",
		icon: IconStar,
		iconBg: "#0D4D4D",
		isReady: false,
	},
	{
		titleKey: "places",
		descriptionKey: "placesDescription",
		countKey: "placesCount",
		icon: IconMapPin,
		iconBg: "#5BC17F",
		href: "/dashboard/places",
		isReady: false,
	},
	{
		titleKey: "proverbsAndIdioms",
		descriptionKey: "wisdomPassedThroughGenerations",
		countKey: "sayingsCount",
		icon: IconFileText,
		iconBg: "#48CBFF",
		isReady: false,
	},
	{
		titleKey: "folktales",
		descriptionKey: "moralStories",
		countKey: "storiesCount",
		icon: IconBook,
		iconBg: "#9748FF",
		isReady: false,
	},
];
