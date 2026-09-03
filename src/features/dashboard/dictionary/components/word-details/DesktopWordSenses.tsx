"use client";

import React from "react";
import { WordMeaningSense } from "./WordMeaningSense";
import { RatingsAndReviewsPanel, LeaveReviewForm } from "../reviews";

interface DesktopWordSensesProps {
	currentMeanings: any[];
	primaryRecord: any;
	activeLang: "urhobo" | "en" | "kor";
	playingAudioUrl: string | null;
	onPlayPronunciation: (url: string) => void;
	displayForLang: any;
	term: string;
	wordId: string;
	onReviewSubmitted: () => void;
	t: (key: string) => string;
}

export const DesktopWordSenses = ({
	currentMeanings,
	primaryRecord,
	activeLang,
	playingAudioUrl,
	onPlayPronunciation,
	displayForLang,
	term,
	wordId,
	onReviewSubmitted,
	t,
}: DesktopWordSensesProps) => {
	// Desktop: two columns with their own scroll areas
	return (
		<div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-8 min-h-0 lg:min-h-[90vh]">
			{/* Left column: Word senses - individual vertical scroll */}
			<div className="h-[90vh] min-h-[400px] w-full overflow-y-auto custom-scrollbar">
				<div className="pb-8">
					{currentMeanings.length > 0 && (
						<div className="flex flex-col gap-6">
							{currentMeanings.map((meaning, index) => {
								const senseNumber = String(index + 1).padStart(2, "0");
								const trans =
									activeLang === "en"
										? primaryRecord?.translations?.en?.[index]
										: activeLang === "kor"
										? primaryRecord?.translations?.kor?.[index]
										: null;
								const transLabel =
									activeLang === "en"
										? t("english")
										: activeLang === "kor"
										? t("korean")
										: "";

								const senseWord =
									trans?.word ??
									primaryRecord?.translations?.en?.[index]?.word ??
									"";

								return (
									<WordMeaningSense
										key={index}
										meaning={meaning}
										senseNumber={senseNumber}
										senseWord={senseWord}
										transLabel={transLabel}
										activeLang={activeLang}
										imageAlt={
											displayForLang?.headword ??
											primaryRecord?.word ??
											term ??
											""
										}
										trans={trans}
										primaryRecord={primaryRecord}
										pronunciation={displayForLang?.pronunciation}
										playingAudioUrl={playingAudioUrl}
										labels={{
											definition: t("definition"),
											partOfSpeech: t("partOfSpeech"),
											imageLabel: t("imageLabel"),
											exampleLabel: t("exampleLabel"),
											plurals: t("plurals"),
											antonyms: t("antonyms"),
											synonyms: t("synonyms"),
										}}
										onPlayPronunciation={onPlayPronunciation}
									/>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{/* Right column: Ratings & Review - individual vertical scroll */}
			<div className="h-[90vh] min-h-[400px] w-full overflow-y-auto custom-scrollbar">
				<div className="pb-8">
					{wordId ? (
						<div className="bg-[#D4E8EA] rounded-xl p-4 sm:p-6 border border-[#9EC9CC]">
							<RatingsAndReviewsPanel wordId={wordId} />
						<LeaveReviewForm
							wordId={wordId}
							onSubmitSuccess={() => onReviewSubmitted()}
						/>
						</div>
					) : (
						<div className="bg-[#D4E8EA] rounded-xl p-4 sm:p-6 border border-[#9EC9CC]">
							<p className="text-sm text-gray-500">
								Ratings and reviews load with word details.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};