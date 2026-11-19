import { cn } from "@/lib/utils";

interface SectionHeadingProps {
	eyebrow?: string;
	title: string;
	description?: string;
	align?: "left" | "center";
	/** Use the inverted palette when the heading sits on the teal band. */
	onDark?: boolean;
	className?: string;
}

export function SectionHeading({
	eyebrow,
	title,
	description,
	align = "left",
	onDark = false,
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3",
				align === "center" && "items-center text-center",
				className,
			)}
		>
			{eyebrow && (
				<span
					className={cn(
						"text-[11px] font-semibold uppercase tracking-[0.22em]",
						onDark ? "text-[#8fd0d8]" : "text-[#0E808D]",
					)}
				>
					{eyebrow}
				</span>
			)}
			<h2
				className={cn(
					"text-2xl font-semibold leading-[1.15] sm:text-3xl lg:text-[38px]",
					onDark ? "text-white" : "text-[#02474F]",
				)}
			>
				{title}
			</h2>
			{description && (
				<p
					className={cn(
						"max-w-2xl text-sm leading-relaxed sm:text-base",
						onDark ? "text-white/70" : "text-[#1A4349]/75",
					)}
				>
					{description}
				</p>
			)}
		</div>
	);
}
