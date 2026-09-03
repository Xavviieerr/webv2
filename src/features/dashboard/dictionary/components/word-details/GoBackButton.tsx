"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface GoBackButtonProps {
	hideTopBar?: boolean;
	onGoBack: () => void;
	label: string;
}

export const GoBackButton = ({ hideTopBar, onGoBack, label }: GoBackButtonProps) => {
	if (hideTopBar) return null;

	return (
		<div className="w-full items-center mx-auto flex justify-between mb-4 sm:mb-6 px-4 sm:px-6">
			<button
				type="button"
				onClick={onGoBack}
				className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
			>
				<ChevronLeft className="w-5 h-5" />
				<span className="text-sm font-medium">{label}</span>
			</button>
		</div>
	);
};