export interface ClassPackage {
	id: string;
	nameKey: string;
	priceNaira: string;
	priceUsd: string;
	sessionsKey: string;
	featureKeys: string[];
	ctaKey: string;
	popular?: boolean;
}

export const CLASS_PACKAGES: ClassPackage[] = [
	{
		id: "starter",
		nameKey: "packageStarter",
		priceNaira: "₦40,000",
		priceUsd: "$35",
		sessionsKey: "starterSessions",
		featureKeys: [
			"starterFeature1",
			"starterFeature2",
			"starterFeature3",
			"starterFeature4",
		],
		ctaKey: "chooseStarter",
	},
	{
		id: "standard",
		nameKey: "packageStandard",
		priceNaira: "₦72,000",
		priceUsd: "$60",
		sessionsKey: "standardSessions",
		featureKeys: [
			"standardFeature1",
			"standardFeature2",
			"standardFeature3",
			"standardFeature4",
			"standardFeature5",
		],
		ctaKey: "chooseStandard",
		popular: true,
	},
	{
		id: "intensive",
		nameKey: "packageIntensive",
		priceNaira: "₦100,000",
		priceUsd: "$85",
		sessionsKey: "intensiveSessions",
		featureKeys: [
			"intensiveFeature1",
			"intensiveFeature2",
			"intensiveFeature3",
			"intensiveFeature4",
		],
		ctaKey: "chooseIntensive",
	},
];
