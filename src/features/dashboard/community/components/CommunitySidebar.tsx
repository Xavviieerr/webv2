"use client";

import { WordOfDayCard } from "./WordOfDayCard";
import { RandomPlaceCard } from "./RandomPlaceCard";
import { NotableFigureCard } from "./NotableFigureCard";

export function CommunitySidebar() {
	return (
		<div className="flex flex-col">
			<WordOfDayCard />
			<div className="mt-14 space-y-5">
				<RandomPlaceCard />
				<NotableFigureCard />
			</div>
		</div>
	);
}
