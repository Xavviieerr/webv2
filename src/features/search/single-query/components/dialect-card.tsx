"use client";

import Image from "next/image";
import { useState } from "react";

export const DialectCard = ({ dialect }: { dialect: string }) => {
	const [showDialect, setShowDialect] = useState(false);

	if (!dialect) return null;

	return (
		<button
			type="button"
			onClick={() => setShowDialect(!showDialect)}
			className="inline-flex items-center gap-0 group text-xs mt-1 border border-[#02474F]/20 rounded-lg px-3 py-1.5 transition-colors hover:border-[#02474F]/40"
		>
			<Image
				src="/images/dialect.svg"
				width={24}
				height={24}
				alt="dialects"
				className="mt-1 shrink-0"
			/>
			<span className="hidden md:inline max-w-0 overflow-hidden opacity-0 invisible group-hover:max-w-[200px] group-hover:opacity-100 group-hover:visible group-hover:ml-1 transition-all duration-200 whitespace-nowrap">
				<span className="inline-block w-1 h-1 rounded-full bg-[#02474F] mr-1.5" />
				<span className="text-[13px] font-medium text-[#02474F]/60">
					{dialect}
				</span>
			</span>
			{showDialect && (
				<span className="inline md:hidden ml-1.5 text-[13px] font-medium text-[#02474F]/60">
					<span className="inline-block w-1 h-1 rounded-full bg-[#02474F] mr-1.5" />
					{dialect}
				</span>
			)}
		</button>
	);
};
