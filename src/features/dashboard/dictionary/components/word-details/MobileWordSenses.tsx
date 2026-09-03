"use client";

import React from "react";
import { WordMeaningSense } from "./WordMeaningSense";
import { RatingsAndReviewsPanel, LeaveReviewForm } from "../reviews";

interface MobileWordSensesProps {
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

export const MobileWordSenses = ({
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
}: MobileWordSensesProps) => {
	// Mobile: Ratings & Reviews stacked below meanings
	return (
		<div className="block lg:hidden mb-8 space-y-6">
			{/* Mobile: Word senses */}
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
									displayForLang?.headword ?? primaryRecord?.word ?? term ?? ""
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

			{/* Mobile: Ratings & Reviews stacked below meanings */}
			<div className="w-full bg-[#D4E8EA] rounded-xl p-4 sm:p-6 border border-[#9EC9CC]">
				{wordId ? (
					<>
						<RatingsAndReviewsPanel wordId={wordId} />
						<LeaveReviewForm
							wordId={wordId}
							onSubmitSuccess={() => onReviewSubmitted()}
						/>
					</>
				) : (
					<p className="text-sm text-gray-500">
						Ratings and reviews load with word details.
					</p>
				)}
			</div>
		</div>
	);
};
