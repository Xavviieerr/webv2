"use client";

import { useState, useCallback } from "react";
import { useGetPlacesQuery } from "../api/placeEndpoints";
import { usePlaceFiltersStore } from "../store/placeFiltersStore";
import { PlacesHeader } from "./places-header";
import { PlaceSearchBar } from "./place-search-bar";
import { PlacesFilterBar } from "./places-filter-bar";
import { PlacesFilterPills } from "./places-filter-pills";
import { PlacesSkeleton } from "./places-skeleton";
import { EmptyState } from "./empty-state";
import { PlaceCard } from "./place-card";
import { PaginationControls } from "./pagination-controls";
import { SuggestPlaceModal } from "./submit/suggest-place-modal";
import { PLACES_PAGE_SIZE } from "../constants";

export function PlacesPage() {
	const [showSuggestModal, setShowSuggestModal] = useState(false);
	const { search, type, sortBy, viewMode, page, resetFilters } =
		usePlaceFiltersStore();

	const sortDir = sortBy === "name" ? "asc" : "desc";
	const sortByParam = sortBy === "name" ? "name" : "createdAt";

	const { data, isLoading, isFetching } = useGetPlacesQuery({
		page,
		limit: PLACES_PAGE_SIZE,
		search: search || undefined,
		type: type || undefined,
		status: "approved",
		sortBy: sortByParam,
		sortDir,
	});

	const places = (data?.items ?? []).filter((p) => p.status === "approved");
	const totalPages = data?.totalPages ?? 0;
	const hasFilters = !!(search || type || sortBy !== "recent");

	const handlePageChange = useCallback((newPage: number) => {
		usePlaceFiltersStore.getState().setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="min-h-0 lg:h-[calc(100vh-var(--top-banners-height,65px))] items-center flex flex-col w-full py-2 lg:px-20 md:px-10 px-4">
			<div className="flex flex-col items-center max-w-2xl w-full mt-8">
				<PlacesHeader />
				<PlaceSearchBar />
			</div>

			<div className="w-full lg:my-10 my-4">
				<PlacesFilterBar onSuggestPlace={() => setShowSuggestModal(true)} />
			</div>

			<PlacesFilterPills />

			{isLoading || (isFetching && !data) ? (
				<PlacesSkeleton viewMode={viewMode} />
			) : places.length === 0 ? (
				<EmptyState
					hasFilters={hasFilters}
					onSuggestPlace={() => setShowSuggestModal(true)}
					onClearFilters={resetFilters}
				/>
			) : (
				<>
					<div
						className={
							viewMode === "grid"
								? "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5"
								: "flex flex-col gap-4 w-full"
						}
					>
						{places.map((place) => (
							<PlaceCard key={place.id} place={place} viewMode={viewMode} />
						))}
					</div>
					<PaginationControls
						page={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			<SuggestPlaceModal
				open={showSuggestModal}
				onClose={() => setShowSuggestModal(false)}
			/>
		</div>
	);
}
