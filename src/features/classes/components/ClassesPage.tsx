"use client";

import { useEffect } from "react";
import { ClassesPackageProvider } from "./ClassesPackageContext";
import { ClassesHero } from "./ClassesHero";
import { TrustStrip } from "./TrustStrip";
import { WhyClasses } from "./WhyClasses";
import { LearningPath } from "./LearningPath";
import { SoloVsClasses } from "./SoloVsClasses";
import { HowClassesWork } from "./HowClassesWork";
import { Coaches } from "./Coaches";
import { Inclusions } from "./Inclusions";
import { Pricing } from "./Pricing";
import { Schedule } from "./Schedule";
import { ClassApplicationForm } from "./ClassApplicationForm";
import { Stories } from "./Stories";
import { Faq } from "./Faq";

export function ClassesPage() {
	// Use the same thin teal scrollbar as the dashboard on this long page.
	useEffect(() => {
		const root = document.documentElement;
		root.classList.add("custom-scrollbar");
		return () => root.classList.remove("custom-scrollbar");
	}, []);

	return (
		<ClassesPackageProvider>
			<main className="w-full">
				<ClassesHero />
				<TrustStrip />
				<WhyClasses />
				<LearningPath />
				<SoloVsClasses />
				<HowClassesWork />
				<Coaches />
				<Inclusions />
				<Pricing />
				<Schedule />
				<ClassApplicationForm />
				<Stories />
				<Faq />
			</main>
		</ClassesPackageProvider>
	);
}
