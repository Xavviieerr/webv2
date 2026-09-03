"use client";

import React from "react";
import { GenericSearchComponent } from "../genericSearchComponent";

interface TopSearchBarProps {
	visible: boolean;
	term: string;
	reverse?: boolean;
	onSearch: (query: string) => void;
}

export const TopSearchBar = ({
	visible,
	term,
	reverse,
	onSearch,
}: TopSearchBarProps) => {
	if (!visible) return null;

	return (
		<div className="w-full max-w-4xl mx-auto mb-6 px-4 sm:px-6">
			<GenericSearchComponent
				onSearchOnly={(newTerm) => {
					if (!newTerm?.trim()) return;
					onSearch(newTerm.trim());
				}}
			/>
		</div>
	);
};
