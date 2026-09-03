"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import { WordRecord } from "@/types/word";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/slice/wordEndpoints";
import { ThankYouForReviewModal } from "./reviews";

import {
	useWordDetails,
	WordDetailsEmbeddedProps,
} from "../hooks/useWordDetails";
import { usePronunciationAudio } from "../hooks/usePronunciationAudio";
import { useActiveLanguage } from "../hooks/useActiveLanguage";
import { GoBackButton } from "./word-details/GoBackButton";
import { TopSearchBar } from "./word-details/TopSearchBar";
import { DesktopWordSenses } from "./word-details/DesktopWordSenses";
import { WordHeader } from "./word-details/WordHeader";
import { WordExplanationTooltip } from "./word-details/WordExplanationTooltip";
import { RelatedWordsSection } from "./RelatedWordsSection";
import { WordNotFoundView } from "./WordNotFoundView";
import { buildWordDetailsHref } from "../utils/buildWordDetailsHref";
import { MobileWordSenses } from "./word-details/MobileWordSenses";

export type WordDetailsPageEmbeddedProps = WordDetailsEmbeddedProps;

export interface WordDetailsPageProps {
	/** When set, use this data instead of fetching from API (e.g. when rendered inside search results). */
	embedded?: WordDetailsPageEmbeddedProps;
	/** When true (e.g. in embedded mode), hide the top Go Back / Ratings bar. */
	hideTopBar?: boolean;
}

export const WordDetailsPage = ({
	embedded,
	hideTopBar = false,
}: WordDetailsPageProps = {}) => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const { term, reverse, data, isLoading, hasTriedReverseFallback, wordId: urlWordId } =
		useWordDetails(embedded);
	const { playingAudioUrl, handlePlayPronunciation } = usePronunciationAudio();
	const { activeLang, setActiveLang } = useActiveLanguage("urhobo");
	const [showWordExplanation, setShowWordExplanation] = useState(false);
	const [showThankYouModal, setShowThankYouModal] = useState(false);

	const { data: favoritesData } = useGetFavoritesQuery();
	const [addFavorite] = useAddFavoriteMutation();
	const [removeFavorite] = useRemoveFavoriteMutation();

	const handleGoBack = () => {
		router.back();
	};

	const handleViewWord = (word: string, useReverse?: boolean) => {
		router.push(buildWordDetailsHref(word, useReverse ?? reverse));
	};

	if (!embedded && isLoading) {
		return (
			<div className="min-h-screen bg-[#D4E8EA] flex justify-center items-center">
				<Loader
					size={40}
					strokeWidth={1.2}
					className="animate-spin text-[#02474F]"
				/>
			</div>
		);
	}

	const allRecords: WordRecord[] = data?.records || [];
	const termLower = term.trim().toLowerCase();

	// Prefer exact Urhobo (ota) match; if none, fall back to matches in translations
	let primaryIndex = allRecords.findIndex((r) => {
		const word = (r.word || "").trim().toLowerCase();
		return word === termLower;
	});

	if (primaryIndex === -1) {
		primaryIndex = allRecords.findIndex((r) => {
			const enMatches = r.translations?.en?.some(
				(t) => t.word?.trim().toLowerCase() === termLower,
			);
			const korMatches = r.translations?.kor?.some(
				(t) => t.word?.trim().toLowerCase() === termLower,
			);
			return !!enMatches || !!korMatches;
		});
	}

	const record: WordRecord | null =
		primaryIndex >= 0
			? allRecords[primaryIndex]
			: allRecords.length > 0
				? allRecords[0]
				: null;

	// If there are no records at all, show "word not found" (only when not embedded).
	// IMPORTANT: when searching English/Korean first (reverse=false), we trigger a reverse=true
	// fallback. During that transition, avoid flashing the not-found view by only rendering it
	// once we've either already tried the reverse fallback or are already in reverse mode.
	if (
		!embedded &&
		allRecords.length === 0 &&
		(reverse || hasTriedReverseFallback)
	) {
		return (
			<WordNotFoundView
				term={term}
				onGoBack={handleGoBack}
				onSearch={(newTerm) => {
					router.push(buildWordDetailsHref(newTerm, reverse));
				}}
			/>
		);
	}

	// Related words: everything except the primary record (if any); exclude the searched term
	let relatedWords: WordRecord[] =
		primaryIndex >= 0
			? allRecords.filter((_, idx) => idx !== primaryIndex)
			: allRecords;
	relatedWords = relatedWords.filter((r) => r.word.toLowerCase() !== termLower);

	// Get wordId: prefer URL param (for newly coined/added words), fallback to search result
	const wordId = urlWordId || (record ? String(record.id || "") : "");

	// Favorites: derive isFavorite from the favorites list by matching word UUID or wordId
	const favoriteWordIds = (favoritesData?.data ?? []).map((fav) => fav.word.id);
	const isFavorite = favoriteWordIds.includes(wordId);

	const handleToggleFavorite = async () => {
		if (!wordId) return;
		try {
			if (isFavorite) {
				await removeFavorite({ wordId }).unwrap();
			} else {
				await addFavorite({ wordId }).unwrap();
			}
		} catch {
			// optimistic rollback handled by RTK Query cache invalidation
		}
	};

	// Always use Urhobo meanings as the base, translations will be shown underneath
	const currentMeanings = record ? record.meanings || [] : [];
	const primaryRecord = record as WordRecord;

	/** Headword and pronunciation for the active translation language */
	const getDisplayForLang = (
		rec: WordRecord,
		lang: "urhobo" | "en" | "kor",
	) => {
		const headword =
			lang === "urhobo"
				? rec.word
				: lang === "en"
					? (rec.translations?.en?.[0]?.word ?? rec.word)
					: (rec.translations?.kor?.[0]?.word ?? rec.word);
		const pronunciation =
			lang === "urhobo"
				? rec.pronunciation
				: lang === "en"
					? rec.translations?.en?.[0]?.pronunciation
					: rec.translations?.kor?.[0]?.pronunciation;
		return { headword, pronunciation };
	};

	const displayForLang = primaryRecord
		? getDisplayForLang(primaryRecord, activeLang)
		: null;

	return (
		<div className="min-h-screen py-6 sm:py-8 w-full max-w-full overflow-x-hidden">
			{/* Word Explanation Tooltip */}
			<WordExplanationTooltip
				open={showWordExplanation}
				creationReason={primaryRecord?.creationReason ?? ""}
				onClose={() => setShowWordExplanation(false)}
				t={t}
			/>

			{/* Go Back Button - hidden when embedded (e.g. in search results) */}
			{!hideTopBar && (
				<GoBackButton
					hideTopBar={hideTopBar}
					onGoBack={handleGoBack}
					label={t("goBack")}
				/>
			)}

			{/* Top search bar for quick lookups (page mode only) */}
			<TopSearchBar
				visible={!embedded}
				term={term}
				reverse={reverse}
				onSearch={(newTerm) => {
					if (!newTerm?.trim()) return;
					handleViewWord(newTerm.trim(), reverse);
				}}
			/>

			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
				{/* Header Section: Word Card */}
				<WordHeader
					displayForLang={displayForLang}
					primaryRecord={primaryRecord}
					term={term}
					activeLang={activeLang}
					onActiveLangChange={setActiveLang}
					onToggleWordExplanation={() => setShowWordExplanation(true)}
					isFavorite={isFavorite}
					onToggleFavorite={handleToggleFavorite}
				/>

				{/* Mobile layout: stack sections without their own scroll areas */}
				<div className="block lg:hidden mb-8 space-y-6">
					<MobileWordSenses
						currentMeanings={currentMeanings}
						primaryRecord={primaryRecord}
						activeLang={activeLang}
						playingAudioUrl={playingAudioUrl}
						onPlayPronunciation={handlePlayPronunciation}
						displayForLang={displayForLang}
						term={term}
						wordId={wordId}
						onReviewSubmitted={() => setShowThankYouModal(true)}
						t={t}
					/>
				</div>

				{/* Desktop: two columns with their own scroll areas */}
				<DesktopWordSenses
					currentMeanings={currentMeanings}
					primaryRecord={primaryRecord}
					activeLang={activeLang}
					playingAudioUrl={playingAudioUrl}
					onPlayPronunciation={handlePlayPronunciation}
					displayForLang={displayForLang}
					term={term}
					wordId={wordId}
					onReviewSubmitted={() => setShowThankYouModal(true)}
					t={t}
				/>

				{/* Related Words Section */}
				{relatedWords.length > 0 && (
					<RelatedWordsSection
						relatedWords={relatedWords}
						records={data?.records}
						playingAudioUrl={playingAudioUrl}
						onPlayPronunciation={handlePlayPronunciation}
						onViewWord={handleViewWord}
						reverse={reverse}
					/>
				)}
			</div>

			<ThankYouForReviewModal
				open={showThankYouModal}
				onOpenChange={setShowThankYouModal}
				onContinue={() => {
					// Continue browsing - modal will close
				}}
			/>
		</div>
	);
};
