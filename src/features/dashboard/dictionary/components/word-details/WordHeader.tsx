"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { WordRecord } from "@/types/word";
import {
	STANDARD_DIALECT,
	LANGUAGE_OPTIONS,
} from "../../constants/wordDetails";

export interface WordHeaderDisplayForLang {
	headword?: string;
	pronunciation?: { ipa?: string; phonetic?: string } | null;
}

interface WordHeaderProps {
	displayForLang: WordHeaderDisplayForLang | null;
	primaryRecord: WordRecord | null;
	term: string;
	activeLang: "urhobo" | "en" | "kor";
	onActiveLangChange: (lang: "urhobo" | "en" | "kor") => void;
	onToggleWordExplanation: () => void;
	isFavorite?: boolean;
	onToggleFavorite?: () => void;
}

/**
 * Header/hero card for the word-details page: the word (with dialect badge),
 * pronunciation pill, word-explanation button, and translation language
 * selector. Pure presentation; all data flows in through props.
 */
export const WordHeader = ({
	displayForLang,
	primaryRecord,
	term,
	activeLang,
	onActiveLangChange,
	onToggleWordExplanation,
	isFavorite = false,
	onToggleFavorite,
}: WordHeaderProps) => {
	const { t } = useTranslation("common");

	return (
		<div className="mb-8 bg-[#D4E8EA] rounded-xl p-4 sm:p-6 border border-[#9EC9CC]">
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
				{/* Left: Word + Checkmark + Phonetic */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black wrap-break-word">
							{displayForLang?.headword ?? primaryRecord?.word ?? term ?? ""}
						</h1>
						{(() => {
							const primaryDialect = primaryRecord?.meanings?.[0]?.dialect;
							const isStandard = primaryDialect === STANDARD_DIALECT;
							if (primaryDialect && !isStandard) {
								return (
									<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#02474F] text-[#02474F] bg-transparent text-sm font-medium">
										<svg
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M10 1.5625C12.3206 1.5625 14.5462 2.48437 16.1872 4.12532C17.8281 5.76626 18.75 7.99186 18.75 10.3125C18.75 12.6331 17.8281 14.8587 16.1872 16.4997C14.5462 18.1406 12.3206 19.0625 10 19.0625C7.67936 19.0625 5.45376 18.1406 3.81282 16.4997C2.17187 14.8587 1.25 12.6331 1.25 10.3125C1.25 7.99186 2.17187 5.76626 3.81282 4.12532C5.45376 2.48437 7.67936 1.5625 10 1.5625ZM11.3125 6.93359C11.9629 6.93359 12.4902 6.48438 12.4902 5.81445C12.4902 5.14453 11.9629 4.69531 11.3125 4.69531C10.6621 4.69531 10.1367 5.14453 10.1367 5.81445C10.1367 6.48438 10.6641 6.93555 11.3125 6.93555M11.541 13.9688C11.541 13.8359 11.5879 13.4883 11.5605 13.2891L10.5332 14.4727C10.3203 14.6953 10.0547 14.8516 9.92969 14.8105C9.87328 14.7895 9.82621 14.749 9.79687 14.6964C9.76753 14.6438 9.75784 14.5825 9.76953 14.5234L11.4805 9.11328C11.6211 8.42578 11.2363 7.80078 10.4199 7.7207C9.56055 7.7207 8.29102 8.59375 7.51953 9.70312C7.51953 9.83594 7.49414 10.1641 7.51953 10.3633L8.54688 9.17969C8.76172 8.95703 9.00781 8.80078 9.13281 8.84375C9.19363 8.8667 9.24333 8.9121 9.27168 8.9706C9.30002 9.02911 9.30484 9.09625 9.28516 9.1582L7.58594 14.543C7.39062 15.1719 7.76172 15.7891 8.66211 15.9297C9.98828 15.9297 10.7715 15.0781 11.543 13.9688H11.541Z"
												fill="#02474F"
											/>
										</svg>
										{primaryDialect && (
											<span className="opacity-90">· {primaryDialect}</span>
										)}
									</span>
								);
							}
							if (isStandard) {
								return (
									<div className="inline-flex items-center gap-0 group">
										<svg
											width="32"
											height="32"
											viewBox="0 0 32 32"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="shrink-0"
											aria-hidden
										>
											<path
												d="M28.2325 12.8525C27.7612 12.36 27.2738 11.8525 27.09 11.4062C26.92 10.9975 26.91 10.32 26.9 9.66375C26.8813 8.44375 26.8612 7.06125 25.9 6.1C24.9387 5.13875 23.5562 5.11875 22.3363 5.1C21.68 5.09 21.0025 5.08 20.5938 4.91C20.1488 4.72625 19.64 4.23875 19.1475 3.7675C18.285 2.93875 17.305 2 16 2C14.695 2 13.7162 2.93875 12.8525 3.7675C12.36 4.23875 11.8525 4.72625 11.4062 4.91C11 5.08 10.32 5.09 9.66375 5.1C8.44375 5.11875 7.06125 5.13875 6.1 6.1C5.13875 7.06125 5.125 8.44375 5.1 9.66375C5.09 10.32 5.08 10.9975 4.91 11.4062C4.72625 11.8512 4.23875 12.36 3.7675 12.8525C2.93875 13.715 2 14.695 2 16C2 17.305 2.93875 18.2837 3.7675 19.1475C4.23875 19.64 4.72625 20.1475 4.91 20.5938C5.08 21.0025 5.09 21.68 5.1 22.3363C5.11875 23.5562 5.13875 24.9387 6.1 25.9C7.06125 26.8612 8.44375 26.8813 9.66375 26.9C10.32 26.91 10.9975 26.92 11.4062 27.09C11.8512 27.2738 12.36 27.7612 12.8525 28.2325C13.715 29.0613 14.695 30 16 30C17.305 30 18.2837 29.0613 19.1475 28.2325C19.64 27.7612 20.1475 27.2738 20.5938 27.09C21.0025 26.92 21.68 26.91 22.3363 26.9C23.5562 26.8813 24.9387 26.8612 25.9 25.9C26.8612 24.9387 26.8813 23.5562 26.9 22.3363C26.91 21.68 26.92 21.0025 27.09 20.5938C27.2738 20.1488 27.7612 19.64 28.2325 19.1475C29.0613 18.285 30 17.305 30 16C30 14.695 29.0613 13.7162 28.2325 12.8525ZM21.7075 13.7075L14.7075 20.7075C14.6146 20.8005 14.5043 20.8742 14.3829 20.9246C14.2615 20.9749 14.1314 21.0008 14 21.0008C13.8686 21.0008 13.7385 20.9749 13.6171 20.9246C13.4957 20.8742 13.3854 20.8005 13.2925 20.7075L10.2925 17.7075C10.1996 17.6146 10.1259 17.5043 10.0756 17.3829C10.0253 17.2615 9.99944 17.1314 9.99944 17C9.99944 16.8686 10.0253 16.7385 10.0756 16.6171C10.1259 16.4957 10.1996 16.3854 10.2925 16.2925C10.4801 16.1049 10.7346 15.9994 11 15.9994C11.1314 15.9994 11.2615 16.0253 11.3829 16.0756C11.5043 16.1259 11.6146 16.1996 11.7075 16.2925L14 18.5863L20.2925 12.2925C20.3854 12.1996 20.4957 12.1259 20.6171 12.0756C20.7385 12.0253 20.8686 11.9994 21 11.9994C21.1314 11.9994 21.2615 12.0253 21.3829 12.0756C21.5043 12.1259 21.6146 12.1996 21.7075 12.2925L21.7075 13.7075Z"
												fill="#02474F"
											/>
										</svg>
										<span className="max-w-0 overflow-hidden opacity-0 invisible group-hover:max-w-[200px] group-hover:opacity-100 group-hover:visible group-hover:ml-1.5 transition-all duration-200 text-xs font-medium text-[#02474F]/60 whitespace-nowrap">
											Dialect: {primaryDialect}
										</span>
									</div>
								);
							}
							return null;
						})()}
					</div>
					{displayForLang?.pronunciation &&
						(displayForLang.pronunciation.ipa ||
							displayForLang.pronunciation.phonetic) && (
							<div className="flex flex-wrap items-center gap-2">
								{displayForLang.pronunciation.ipa && (
									<span className="rounded-full px-3 py-1.5 italic sm:px-4 bg-[#0D4D4D] text-white text-sm sm:text-base font-sans">
										/{displayForLang.pronunciation.ipa}/
									</span>
								)}
							</div>
						)}
				</div>

				{/* Right: Favorite + Word Explanation + Translation */}
				<div className="flex flex-col items-start lg:items-end gap-3 shrink-0 w-full lg:w-auto">
					{onToggleFavorite && (
						<button
							type="button"
							onClick={onToggleFavorite}
							className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap text-sm sm:text-base ${
								isFavorite
									? "bg-[#F5DEB3]/20 text-[#02474F] hover:bg-[#F5DEB3]/30"
									: "bg-[#D4E8EA] text-[#02474F] hover:bg-[#B3E0E6]"
							}`}
						>
							{isFavorite ? (
								<IconHeartFilled className="w-4 h-4 text-amber-500" />
							) : (
								<IconHeart className="w-4 h-4" />
							)}
							<span>
								{isFavorite
									? t("favorited", "Favorited")
									: t("favorite", "Favorite")}
							</span>
						</button>
					)}
					{primaryRecord?.otaOkpopko && primaryRecord?.creationReason && (
						<button
							type="button"
							onClick={() => onToggleWordExplanation()}
							className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer bg-[#0D4D4D] hover:bg-[#0D4D4D]/90 text-[#B3E0E6] transition-colors whitespace-nowrap text-xs sm:text-sm"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="shrink-0"
							>
								<path
									d="M9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125ZM10.1813 5.95898C10.7666 5.95898 11.2412 5.55469 11.2412 4.95176C11.2412 4.34883 10.7666 3.94453 10.1813 3.94453C9.5959 3.94453 9.12305 4.34883 9.12305 4.95176C9.12305 5.55469 9.59766 5.96074 10.1813 5.96074M10.3869 12.2906C10.3869 12.1711 10.4291 11.8582 10.4045 11.6789L9.47988 12.7441C9.28828 12.9445 9.04922 13.0852 8.93672 13.0482C8.88595 13.0293 8.84359 12.9929 8.81718 12.9455C8.79078 12.8982 8.78206 12.843 8.79258 12.7898L10.3324 7.9207C10.459 7.30195 10.1127 6.73945 9.37793 6.66738C8.60449 6.66738 7.46191 7.45312 6.76758 8.45156C6.76758 8.57109 6.74473 8.86641 6.76758 9.0457L7.69219 7.98047C7.88555 7.78008 8.10703 7.63945 8.21953 7.67812C8.27427 7.69878 8.319 7.73964 8.34451 7.79229C8.37002 7.84494 8.37436 7.90538 8.35664 7.96113L6.82734 12.8074C6.65156 13.3734 6.98555 13.9289 7.7959 14.0555C8.98945 14.0555 9.69434 13.2891 10.3887 12.2906H10.3869Z"
									fill="#B3E0E6"
								/>
							</svg>
							<span className="underline">{t("wordExplanation")}</span>
						</button>
					)}
					<div className="flex items-center gap-2">
						{/* <span className="text-xs sm:text-sm font-sans text-black whitespace-nowrap">Translation:</span> */}
						<Select
							value={activeLang}
							onValueChange={(v) =>
								onActiveLangChange(v as "urhobo" | "en" | "kor")
							}
						>
							<SelectTrigger className="min-w-[100px] border-gray-300 bg-[#B3E0E6] text-xs sm:text-sm font-medium text-black focus:ring-2 focus:ring-[#02474F] focus:ring-offset-0">
								<SelectValue placeholder={t("translation")} />
							</SelectTrigger>
							<SelectContent>
								{LANGUAGE_OPTIONS.map((lang) => (
									<SelectItem key={lang.value} value={lang.value}>
										{lang.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	);
};
