import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "tint" | "white" | "cream" | "teal";
type SectionPadding = "default" | "hero" | "compact" | "none";

const TONE_CLASS: Record<SectionTone, string> = {
	tint: "bg-[#F2FEFF]",
	white: "bg-white",
	cream: "bg-[#FBF5EA]",
	teal: "bg-[#02474F] text-white",
};

// Vertical rhythm lives here so no section has to fight the defaults with
// conflicting utility classes.
const PADDING_CLASS: Record<SectionPadding, string> = {
	default: "py-14 sm:py-16 lg:py-20",
	hero: "pb-14 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16",
	compact: "py-5 sm:py-6",
	none: "",
};

interface ClassesSectionProps {
	tone?: SectionTone;
	padding?: SectionPadding;
	id?: string;
	/** Extra classes for the outer full-bleed band. */
	className?: string;
	/** Extra classes for the inner shell (layout only, not padding). */
	contentClassName?: string;
	children: ReactNode;
}

/**
 * Full-bleed band with a single shared content shell. Every `/classes` block
 * uses it so margins, max width and vertical rhythm stay consistent.
 */
export function ClassesSection({
	tone = "white",
	padding = "default",
	id,
	className,
	contentClassName,
	children,
}: ClassesSectionProps) {
	return (
		<section
			id={id}
			className={cn("w-full scroll-mt-28", TONE_CLASS[tone], className)}
		>
			<div
				className={cn(
					"mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-10 xl:px-14",
					PADDING_CLASS[padding],
					contentClassName,
				)}
			>
				{children}
			</div>
		</section>
	);
}
