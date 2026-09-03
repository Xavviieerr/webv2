import type { PlaceViewMode } from "../types";

interface PlacesSkeletonProps {
	viewMode: PlaceViewMode;
}

export function PlacesSkeleton({ viewMode }: PlacesSkeletonProps) {
	if (viewMode === "list") {
		return (
			<div className="flex flex-col gap-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="bg-[#D4E8EA]/70 rounded-xl px-5 sm:px-6 py-5 border border-[#02474F]/10 animate-pulse"
					>
						<div className="flex gap-4">
							<div className="w-24 h-24 rounded-lg shrink-0" style={{ backgroundColor: "#8AA5A81A" }} />
							<div className="flex-1 flex flex-col gap-2">
								<div className="h-5 rounded w-1/3" style={{ backgroundColor: "#8AA5A81A" }} />
								<div className="h-4 rounded w-2/3" style={{ backgroundColor: "#8AA5A81A" }} />
								<div className="h-3 rounded w-1/4 mt-auto" style={{ backgroundColor: "#8AA5A81A" }} />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="bg-[#D4E8EA]/70 rounded-xl px-5 sm:px-6 py-5 border border-[#02474F]/10 animate-pulse min-h-[180px] flex flex-col"
				>
					<div className="h-5 rounded w-2/3 mb-2" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="h-4 rounded w-full mb-1" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="h-4 rounded w-4/5 mb-3" style={{ backgroundColor: "#8AA5A81A" }} />
					<div className="mt-auto flex gap-2">
						<div className="h-6 rounded-full w-16" style={{ backgroundColor: "#8AA5A81A" }} />
						<div className="h-6 rounded-full w-20" style={{ backgroundColor: "#8AA5A81A" }} />
					</div>
				</div>
			))}
		</div>
	);
}
