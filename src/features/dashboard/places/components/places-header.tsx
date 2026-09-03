"use client";

import { useTranslation } from "react-i18next";
import { IconMapPin } from "@tabler/icons-react";

export function PlacesHeader() {
	const { t } = useTranslation("common");

	return (
		<>
			<div className="h-18 w-18 bg-[#02474F] text-[#F5DEB3] flex justify-center items-center rounded-full mb-5">
				<IconMapPin size={36} />
			</div>
			<h1 className="text-4xl max-md:text-2xl font-medium text-[#02474F]">
				{t("places", "Places")}
			</h1>
			<p className="text-lg max-md:text-base pt-3 pb-2 max-lg:text-center mb-2 text-[#0D4D4D]/70">
				{t("placesDescription", "Discover significant Urhobo locations, landmarks, businesses, and cultural sites.")}
			</p>
		</>
	);
}
