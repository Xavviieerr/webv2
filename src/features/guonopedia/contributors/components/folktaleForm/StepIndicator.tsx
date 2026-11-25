"use client";

import { useTranslation } from "react-i18next";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FOLKTALE_STEPS, type FolktaleStep } from "../../folktaleForm/types";

export function StepIndicator({
	step,
	onSelect,
}: {
	step: FolktaleStep;
	onSelect: (step: FolktaleStep) => void;
}) {
	const { t } = useTranslation("common");

	return (
		<ol className="flex flex-wrap items-center gap-2">
			{FOLKTALE_STEPS.map((item) => {
				const isCurrent = item.id === step;
				const isDone = item.id < step;

				return (
					<li key={item.id}>
						<button
							type="button"
							onClick={() => onSelect(item.id)}
							disabled={item.id >= step}
							aria-current={isCurrent ? "step" : undefined}
							className={cn(
								"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
								isCurrent
									? "border-[#0D4D4D] bg-[#0D4D4D] text-white"
									: isDone
										? "border-[#0D4D4D]/20 bg-[#D4E8EA] text-[#0D4D4D] hover:border-[#0D4D4D]/40"
										: "cursor-default border-[#0D4D4D]/10 bg-[#D4E8EA]/50 text-[#0D4D4D]/40",
							)}
						>
							<span
								className={cn(
									"flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
									isCurrent
										? "bg-white text-[#0D4D4D]"
										: isDone
											? "bg-[#0D4D4D] text-white"
											: "bg-[#0D4D4D]/10 text-[#0D4D4D]/50",
								)}
							>
								{isDone ? (
									<IconCheck className="h-3 w-3" />
								) : (
									item.id
								)}
							</span>
							<span className="hidden sm:inline">
								{t(item.labelKey)}
							</span>
						</button>
					</li>
				);
			})}
		</ol>
	);
}
