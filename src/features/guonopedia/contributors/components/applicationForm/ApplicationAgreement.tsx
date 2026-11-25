"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const POLICY_HREF = "/guonopedia/contribute/policy";

export function ApplicationAgreement({
	agree,
	error,
	onChange,
}: {
	agree: boolean;
	error?: string;
	onChange: (checked: boolean) => void;
}) {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-2">
			<label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
				<input
					type="checkbox"
					checked={agree}
					onChange={(event) => onChange(event.target.checked)}
					className="mt-0.5 h-4 w-4 accent-[#0D4D4D]"
				/>
				<span>
					{t("agreeContributorPolicy")}{" "}
					<Link
						href={POLICY_HREF}
						target="_blank"
						rel="noreferrer"
						onClick={(event) => event.stopPropagation()}
						className="font-semibold text-[#0D4D4D] underline underline-offset-2"
					>
						{t("contributorPolicyLink")}
					</Link>
				</span>
			</label>
			{error && (
				<p className="text-xs font-medium text-red-600">{t(error)}</p>
			)}
		</section>
	);
}
