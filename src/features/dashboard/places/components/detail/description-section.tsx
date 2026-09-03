"use client";

import { useState } from "react";

interface DescriptionSectionProps {
	description: string;
	culturalSignificance?: string;
}

export function DescriptionSection({ description, culturalSignificance }: DescriptionSectionProps) {
	const [expanded, setExpanded] = useState(false);
	const shouldTruncate = description.length > 300;

	return (
		<div className="bg-[#F2FEFF] rounded-2xl border border-[#02474F]/10 shadow-lg p-5 sm:p-6 space-y-4">
			<div>
				<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D] mb-3">About this place</h2>
				<p className="text-[15px] text-[#02474F]/70 leading-[1.7] whitespace-pre-line">
					{shouldTruncate && !expanded ? `${description.slice(0, 300)}...` : description}
				</p>
				{shouldTruncate && (
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="text-[11px] font-medium text-[#0E808D] mt-2 hover:underline cursor-pointer"
					>
						{expanded ? "See less" : "See more"}
					</button>
				)}
			</div>

			{culturalSignificance && (
				<div className="bg-[#D4E8EA]/50 rounded-xl p-4">
					<h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D] mb-2">Cultural Significance</h3>
					<p className="text-[15px] text-[#02474F]/70 italic leading-[1.7] whitespace-pre-line">
						{culturalSignificance}
					</p>
				</div>
			)}
		</div>
	);
}
