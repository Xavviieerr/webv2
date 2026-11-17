"use client";

import { useEffect } from "react";
import { ClassesHero } from "./ClassesHero";
import { WhyClasses } from "./WhyClasses";
import { LearningPath } from "./LearningPath";
import { HowClassesWork } from "./HowClassesWork";
import { Coaches } from "./Coaches";
import { Pricing } from "./Pricing";
import { ClassApplicationForm } from "./ClassApplicationForm";
import { PersonalClassesSection } from "./PersonalClassesSection";
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
		<main className="w-full">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:gap-16 sm:px-6 sm:py-10 lg:px-8">
				<ClassesHero />
				<WhyClasses />
				<LearningPath />
				<HowClassesWork />
				<Coaches />
				<Pricing />
				<ClassApplicationForm />
				<PersonalClassesSection />
				<Stories />
				<Faq />
			</div>
		</main>
	);
}
