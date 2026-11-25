"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconCheck, IconLoader2, IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLazyAutocompleteQuery } from "@/slice/wordEndpoints";

interface DictionarySuggestion {
	id?: string;
	word: string;
	eyuo?: string;
	eyuoEng?: string[];
	eyuoKor?: string;
}

interface GlossaryTermPickerProps {
	id: string;
	value: string;
	/** True once the contributor picked a word from the dictionary list. */
	selected: boolean;
	hasError?: boolean;
	onChange: (value: string) => void;
	onSelect: (word: string) => void;
	onBlur: () => void;
}

function suggestionCaption(item: DictionarySuggestion): string | undefined {
	const english = (item.eyuoEng ?? []).filter(Boolean).slice(0, 2).join(", ");
	return english || item.eyuo || item.eyuoKor;
}

/**
 * Glossary term input backed by the same dictionary search the Dictionary page
 * uses: type a word, pick one from the short suggestion list.
 */
export function GlossaryTermPicker({
	id,
	value,
	selected,
	hasError,
	onChange,
	onSelect,
	onBlur,
}: GlossaryTermPickerProps) {
	const { t } = useTranslation("common");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [requiresAuth, setRequiresAuth] = useState(false);
	const [suggestions, setSuggestions] = useState<DictionarySuggestion[]>([]);
	const [fetchSuggestions] = useLazyAutocompleteQuery();
	const blurTimer = useRef<number | null>(null);

	useEffect(() => {
		if (!open) return;
		const query = value.trim();
		if (query.length < 2) {
			setSuggestions([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const timer = window.setTimeout(async () => {
			try {
				const result = await fetchSuggestions({ q: query }).unwrap();
				if (Array.isArray(result)) {
					setSuggestions(result.slice(0, 6));
					setRequiresAuth(false);
				} else {
					setSuggestions([]);
					setRequiresAuth(true);
				}
			} catch {
				setSuggestions([]);
			} finally {
				setLoading(false);
			}
		}, 300);

		return () => window.clearTimeout(timer);
	}, [value, open, fetchSuggestions]);

	useEffect(
		() => () => {
			if (blurTimer.current) window.clearTimeout(blurTimer.current);
		},
		[],
	);

	const handleBlur = () => {
		if (blurTimer.current) window.clearTimeout(blurTimer.current);
		blurTimer.current = window.setTimeout(() => {
			setOpen(false);
			onBlur();
		}, 150);
	};

	const pick = (word: string) => {
		if (blurTimer.current) window.clearTimeout(blurTimer.current);
		onSelect(word);
		setSuggestions([]);
		setOpen(false);
	};

	const showPanel = open && value.trim().length >= 2;

	return (
		<div className="relative">
			<IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D4D4D]/40" />
			<input
				id={id}
				value={value}
				autoComplete="off"
				placeholder={t("glossarySearchPlaceholder")}
				onChange={(event) => onChange(event.target.value)}
				onFocus={() => setOpen(true)}
				onBlur={handleBlur}
				className={cn(
					"w-full rounded-xl border-2 border-[#0D4D4D]/15 bg-white py-2.5 pl-9 pr-9 text-sm text-[#0D4D4D] outline-none transition-colors placeholder:text-[#0D4D4D]/35 focus:border-[#41A3AD]",
					hasError && "border-red-400",
				)}
			/>
			{selected && (
				<IconCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2E7D32]" />
			)}

			{showPanel && (
				<div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#0D4D4D]/15 bg-white shadow-xl shadow-[#0D4D4D]/10">
					{loading ? (
						<div className="flex items-center gap-2 px-4 py-3 text-xs text-[#0D4D4D]/60">
							<IconLoader2 className="h-4 w-4 animate-spin" />
							{t("glossarySearching")}
						</div>
					) : requiresAuth ? (
						<p className="px-4 py-3 text-xs text-[#0D4D4D]/60">
							{t("glossarySearchRequiresAuth")}
						</p>
					) : suggestions.length === 0 ? (
						<p className="px-4 py-3 text-xs text-[#0D4D4D]/60">
							{t("glossarySearchEmpty")}
						</p>
					) : (
						<ul className="max-h-64 overflow-y-auto p-1.5">
							{suggestions.map((item) => {
								const caption = suggestionCaption(item);
								return (
									<li
										key={`${item.id ?? item.word}-${item.word}`}
									>
										<button
											type="button"
											onMouseDown={(event) => {
												event.preventDefault();
												pick(item.word);
											}}
											className="flex w-full min-w-0 flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#D4E8EA] focus:bg-[#D4E8EA] focus:outline-none"
										>
											<span className="break-words text-sm font-semibold text-[#0D4D4D] [overflow-wrap:anywhere]">
												{item.word}
											</span>
											{caption && (
												<span className="truncate text-xs text-[#0D4D4D]/55">
													{caption}
												</span>
											)}
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
