import {
	IconBook,
	IconUser,
	IconStar,
	IconPalette,
	IconBook2,
	IconMessage,
	IconMapPin,
} from "@tabler/icons-react";
import type { ElementType } from "react";

export interface GuonopediaCategory {
	titleKey: string;
	descriptionKey: string;
	icon: ElementType;
	iconBg: string;
	href?: string;
	isReady: boolean;
	countLabel?: string;
}

export const guonopediaCategories: GuonopediaCategory[] = [
	{
		titleKey: "urhoboDictionary",
		descriptionKey: "dictionaryDescription",
		icon: IconBook,
		iconBg: "#59431B",
		href: "/dashboard/dictionary",
		isReady: true,
		countLabel: "entries",
	},
	{
		titleKey: "names",
		descriptionKey: "namesDescription",
		icon: IconUser,
		iconBg: "#FF9448",
		href: "/dashboard/names",
		isReady: true,
		countLabel: "names",
	},
	{
		titleKey: "notableFigures",
		descriptionKey: "notableUrhoboLeaders",
		icon: IconStar,
		iconBg: "#0D4D4D",
		href: "/dashboard/figures",
		isReady: true,
		countLabel: "figures",
	},
	{
		titleKey: "places",
		descriptionKey: "placesDescription",
		icon: IconMapPin,
		iconBg: "#9748FF",
		href: "/dashboard/places",
		isReady: true,
		countLabel: "placesCount",
	},
	{
		titleKey: "customAndTradition",
		descriptionKey: "customAndTraditionDescription",
		icon: IconPalette,
		iconBg: "#E85D75",
		isReady: false,
	},
	{
		titleKey: "folktales",
		descriptionKey: "folktalesDescription",
		icon: IconBook2,
		iconBg: "#2E7D32",
		isReady: false,
	},
	{
		titleKey: "proverbsAndIdioms",
		descriptionKey: "idiomsDescription",
		icon: IconMessage,
		iconBg: "#1565C0",
		isReady: false,
	},
];
