"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function ContributePage() {
	const { t } = useTranslation("common");
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
			<div className="max-w-md w-full text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4E8EA] text-[#1A4349] mb-6">
					<BookOpen className="w-8 h-8" />
				</div>
				<h1 className="text-2xl font-semibold text-[#291E0A] mb-2">
					{t("comingSoon")}
				</h1>
				<p className="text-[#111111] text-base leading-relaxed mb-8">
					{t("comingSoonMessage")}
				</p>
				<button
					type="button"
					onClick={() => router.push("/guonopedia")}
					className="inline-flex items-center justify-center rounded-lg bg-[#1A4349] text-white font-medium px-6 py-3 hover:bg-[#1A4349]/90 transition-colors"
				>
					Back to Guonopedia
				</button>
			</div>
		</div>
	);
}
