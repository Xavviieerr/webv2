"use client";

import { WelcomeBanner } from "./WelcomeBanner";
import { QuickAccessSection } from "./QuickAccessSection";
import { FeaturedContent } from "./FeaturedContent";
import { PostToCommunity } from "./PostToCommunity";
import { ClassesPromoCard } from "@/features/classes";
import { ContributorDashboardCard } from "@/features/guonopedia/contributors";

export function DashboardHome() {
	return (
		<>
			<WelcomeBanner />
			<QuickAccessSection />
			<div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
				<ContributorDashboardCard />
				<ClassesPromoCard
					descriptionKey="dashboardClassesDescription"
					className="h-full"
				/>
			</div>
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
				<FeaturedContent />
				<PostToCommunity isVisible={true} />
			</div>
		</>
	);
}
