import type { ElementType } from "react";

export interface DashboardNavItem {
	title: string;
	i18nKey?: string;
	url?: string;
	icon: ElementType;
	isActiveItem?: boolean;
	isLogout?: boolean;
	isExternal?: boolean;
	exact?: boolean;
}

import {
	IconHelpCircle,
	IconLayoutGrid,
	IconLogout,
	IconMapPin,
	IconMusic,
	IconRun,
	IconSettings,
	IconStar,
	IconUsersGroup,
} from "@tabler/icons-react";

export const navPrimary: DashboardNavItem[] = [
	{
		title: "Dashboard",
		i18nKey: "dashboard",
		url: "/dashboard",
		icon: IconLayoutGrid,
		isActiveItem: true,
		exact: true,
	},
	{
		title: "Community",
		i18nKey: "community",
		url: "/dashboard/community",
		icon: IconUsersGroup,
		isActiveItem: true,
	},
	{
		title: "Guonopedia",
		i18nKey: "guonopedia",
		url: "/guonopedia",
		icon: IconStar,
		isActiveItem: true,
	},
	{
		title: "Music",
		i18nKey: "music",
		url: "/dashboard/music",
		icon: IconMusic,
		isActiveItem: true,
	},
	{
		title: "Sports",
		i18nKey: "sports",
		url: "/dashboard/sports",
		icon: IconRun,
		isActiveItem: true,
	},
];

// Hidden items — re-enable when pages are built
// {
// 	title: "Dictionary",
// 	i18nKey: "urhoboDictionary",
// 	url: "/dashboard/dictionary",
// 	icon: IconBook,
// 	isActiveItem: true,
// },
// {
// 	title: "Figures",
// 	i18nKey: "historicFigures",
// 	url: "/dashboard/figures",
// 	icon: IconUsers,
// 	isActiveItem: true,
// },
// {
// 	title: "Names",
// 	i18nKey: "urhoboNames",
// 	url: "/dashboard/names",
// 	icon: IconList,
// 	isActiveItem: true,
// },
// {
// 	title: "Lyrics",
// 	i18nKey: "lyrics",
// 	url: "#",
// 	icon: IconMusic,
// 	isActiveItem: false,
// },
// {
// 	title: "Historical Features",
// 	i18nKey: "historicalFeatures",
// 	url: "#",
// 	icon: IconStar,
// 	isActiveItem: false,
// },
// {
// 	title: "Places",
// 	i18nKey: "places",
// 	url: "#",
// 	icon: IconMapPin,
// 	isActiveItem: false,
// },
// {
// 	title: "Cultural Practices",
// 	i18nKey: "culturalPractices",
// 	url: "#",
// 	icon: IconUsers,
// 	isActiveItem: false,
// },
// {
// 	title: "Proverbs & Idioms",
// 	i18nKey: "proverbsAndIdioms",
// 	url: "#",
// 	icon: IconFileText,
// 	isActiveItem: false,
// },
// {
// 	title: "Folk Tales",
// 	i18nKey: "folktales",
// 	url: "#",
// 	icon: IconFileText,
// 	isActiveItem: false,
// },

export const navUtility: DashboardNavItem[] = [
	{
		title: "Help & Support",
		i18nKey: "helpAndSupport",
		url: "/dashboard/help",
		icon: IconHelpCircle,
	},
	{
		title: "Settings",
		i18nKey: "settings",
		url: "/dashboard/settings",
		icon: IconSettings,
	},
	{
		title: "Logout",
		i18nKey: "logout",
		icon: IconLogout,
		isLogout: true,
	},
];
