"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface PostToCommunityProps {
	isVisible?: boolean;
}

export function PostToCommunity({ isVisible = true }: PostToCommunityProps) {
	const { t } = useTranslation("common");
	if (!isVisible) {
		return null;
	}
	return (
		<Link
			href="/dashboard/community/#"
			className="w-full lg:min-w-[280px] lg:max-w-[316px] block"
		>
			<button
				type="button"
				className="relative w-full lg:min-w-[280px] lg:max-w-[316px] h-[329px] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md hover:opacity-95 transition-all"
				aria-label={t("postToCommunity")}
			>
				<Image
					src="/Banner.png"
					alt={t("postToCommunity")}
					width={270}
					height={290}
					className="object-cover object-center mx-auto"
				/>
			</button>
		</Link>
	);
}
