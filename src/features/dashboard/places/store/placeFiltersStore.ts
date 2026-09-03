import { create } from "zustand";
import type { PlaceSortOption, PlaceViewMode } from "../types";

interface PlaceFiltersState {
	search: string;
	type: string;
	status: string;
	sortBy: PlaceSortOption;
	viewMode: PlaceViewMode;
	page: number;
	setSearch: (search: string) => void;
	setType: (type: string) => void;
	setStatus: (status: string) => void;
	setSortBy: (sortBy: PlaceSortOption) => void;
	setViewMode: (viewMode: PlaceViewMode) => void;
	setPage: (page: number) => void;
	resetFilters: () => void;
}

const initialState = {
	search: "",
	type: "",
	status: "approved",
	sortBy: "recent" as PlaceSortOption,
	viewMode: "grid" as PlaceViewMode,
	page: 1,
};

export const usePlaceFiltersStore = create<PlaceFiltersState>((set) => ({
	...initialState,
	setSearch: (search) => set({ search, page: 1 }),
	setType: (type) => set({ type, page: 1 }),
	setStatus: (status) => set({ status, page: 1 }),
	setSortBy: (sortBy) => set({ sortBy, page: 1 }),
	setViewMode: (viewMode) => set({ viewMode }),
	setPage: (page) => set({ page }),
	resetFilters: () => set(initialState),
}));
