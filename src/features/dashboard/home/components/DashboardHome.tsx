"use client";

import { WelcomeBanner } from "./WelcomeBanner";
import { QuickAccessSection } from "./QuickAccessSection";
import { FeaturedContent } from "./FeaturedContent";
import { PostToCommunity } from "./PostToCommunity";

export function DashboardHome() {
	return (
		<>
			<WelcomeBanner />
			<QuickAccessSection />
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
				<FeaturedContent />
				<PostToCommunity isVisible={true} />
			</div>
		</>
	);
}
