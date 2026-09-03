"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useLazyGetPlacesQuery } from "../api/placeEndpoints";
import { Search, Loader, X, Clock, MapPin } from "lucide-react";

const HISTORY_KEY = "placesSearchHistory";
const MAX_HISTORY = 10;

function loadHistory(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const saved = localStorage.getItem(HISTORY_KEY);
		return saved ? JSON.parse(saved) : [];
	} catch {
		return [];
	}
}

function persistHistory(history: string[]) {
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
	} catch {}
}

function formatType(type: string): string {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function PlaceSearchBar() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [history, setHistory] = useState<string[]>(loadHistory);

	const suggestionRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedValue = useDebounce(searchTerm.trim(), 500);
	const [triggerSearch, { data, isLoading }] = useLazyGetPlacesQuery();

	useEffect(() => {
		if (!debouncedValue) return;
		triggerSearch({ search: debouncedValue, page: 1, limit: 5, status: "approved" });
	}, [debouncedValue, triggerSearch]);

	const suggestions = data?.items ?? [];

	const saveToHistory = useCallback((term: string) => {
		const normalized = term.toLowerCase().trim();
		if (!normalized) return;
		setHistory((prev) => {
			const filtered = prev.filter((item) => item !== normalized);
			const next =
				filtered.length >= MAX_HISTORY
					? [normalized, ...filtered.slice(0, MAX_HISTORY - 1)]
					: [normalized, ...filtered];
			persistHistory(next);
			return next;
		});
	}, []);

	const removeFromHistory = useCallback((term: string) => {
		const normalized = term.toLowerCase().trim();
		setHistory((prev) => {
			const next = prev.filter((item) => item !== normalized);
			persistHistory(next);
			return next;
		});
	}, []);

	const clearHistory = useCallback(() => {
		setHistory([]);
		persistHistory([]);
	}, []);

	const handleSelectPlace = useCallback(
		(id: string) => {
			if (searchTerm.trim()) {
				saveToHistory(searchTerm);
			}
			setSearchTerm("");
			setShowSuggestions(false);
			router.push(`/dashboard/places/${id}`);
		},
		[searchTerm, router, saveToHistory],
	);

	const handleEnter = useCallback(() => {
		setShowSuggestions(false);
		if (searchTerm.trim()) {
			saveToHistory(searchTerm);
		}
	}, [searchTerm, saveToHistory]);

	const showHistory = showSuggestions && !searchTerm && history.length > 0;
	const showResults = showSuggestions && searchTerm && suggestions.length > 0;
	const showNoResults = showSuggestions && searchTerm && !isLoading && suggestions.length === 0;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={suggestionRef} className="relative w-full">
			<div className="border border-[#02474F]/20 relative flex items-center w-full rounded-full">
				<Search
					strokeWidth={1.3}
					size={18}
					className="absolute left-4 text-gray-500 pointer-events-none"
				/>
				<input
					type="text"
					ref={inputRef}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setShowSuggestions(true)}
					onClick={() => setShowSuggestions(true)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleEnter();
						if (!showSuggestions) setShowSuggestions(true);
					}}
					placeholder="Search for a place..."
					className="py-3 pl-11 pr-10 w-full outline-none rounded-full bg-[#F2FEFF] text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/40"
				/>
				<div className="flex gap-2 absolute right-3">
					{isLoading ? (
						<Loader size={18} className="text-gray-500 mt-1 animate-spin" />
					) : (
						searchTerm && (
							<button
								onClick={() => {
									setSearchTerm("");
									inputRef.current?.focus();
								}}
								className="p-1 rounded-full hover:bg-[#D4E8EA]/50"
							>
								<X size={18} strokeWidth={1.3} />
							</button>
						)
					)}
				</div>
			</div>

			{showHistory && (
				<div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border border-[#02474F]/10 bg-[#F2FEFF] z-50 overflow-hidden">
					<div className="flex items-center justify-between px-4 py-2.5 border-b border-[#02474F]/5">
						<p className="text-xs font-medium text-[#0D4D4D]/50">Recent Searches</p>
						{history.length > 0 && (
							<button
								type="button"
								onMouseDown={(e) => {
									e.preventDefault();
									clearHistory();
								}}
								className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors"
							>
								Clear all
							</button>
						)}
					</div>
					<div className="max-h-48 overflow-y-auto custom-scrollbar py-1">
						{history.map((term) => (
							<div
								key={term}
								className="flex items-center gap-2 py-1.5 group hover:bg-[#D4E8EA]/40 px-4 cursor-pointer"
							>
								<button
									onMouseDown={(e) => {
										e.preventDefault();
										setSearchTerm(term);
									}}
									className="flex items-center gap-2.5 flex-1"
								>
									<Clock
										strokeWidth={1.2}
										className="group-hover:text-[#0E808D] shrink-0"
										size={14}
									/>
									<p className="font-medium text-sm text-[#0D4D4D] truncate">{term}</p>
								</button>
								<button
									onMouseDown={(e) => {
										e.preventDefault();
										removeFromHistory(term);
									}}
									className="cursor-pointer hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
								>
									<X strokeWidth={1.5} size={14} />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{showResults && (
				<div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border border-[#02474F]/10 bg-[#F2FEFF] z-50 overflow-hidden">
					<div className="px-4 py-2.5 border-b border-[#02474F]/5">
						<p className="text-xs font-medium text-[#0D4D4D]/50">Places</p>
					</div>
					<div className="max-h-48 overflow-y-auto custom-scrollbar py-1">
						{suggestions.map((place) => (
							<button
								key={place.id}
								onClick={() => handleSelectPlace(place.id)}
								className="flex items-center gap-2.5 py-2 group hover:bg-[#D4E8EA]/40 cursor-pointer px-4 w-full text-left"
							>
								<MapPin
									strokeWidth={1.2}
									className="text-[#0D4D4D]/30 group-hover:text-[#0E808D] shrink-0"
									size={14}
								/>
								<div className="flex flex-col min-w-0">
									<p className="font-medium text-sm text-[#02474F] truncate">
										{place.name}
									</p>
									<p className="text-[11px] text-[#0D4D4D]/45 truncate">
										{formatType(place.type)}
										{place.location?.city && ` · ${place.location.city}`}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{showNoResults && (
				<div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border border-[#02474F]/10 bg-[#F2FEFF] z-50 p-4 text-center text-sm text-[#0D4D4D]/50">
					No places found for &ldquo;{searchTerm}&rdquo;
				</div>
			)}
		</div>
	);
}
