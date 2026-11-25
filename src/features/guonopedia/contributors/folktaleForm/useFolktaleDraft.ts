"use client";

import { useMemo, useRef, useState } from "react";
import { findStoryMarker } from "../schemas/folktaleSchema";
import {
	CHARACTERS_STEP,
	EMPTY_CHARACTER,
	EMPTY_FOLKTALE_FORM,
	EMPTY_GLOSSARY,
	REVIEW_STEP,
	STORY_STEP,
	type CharacterDraft,
	type FolktaleFormState,
	type FolktaleStep,
	type GlossaryDraft,
} from "./types";
import {
	getCharacterErrors,
	getDuplicateGlossaryTerms,
	getGlossaryErrors,
	getStoryErrors,
} from "./validation";

interface UseFolktaleDraftOptions {
	initialForm?: FolktaleFormState;
	initialSelectedTerms?: string[];
}

/**
 * Owns every piece of state and every mutation of the folktale draft form.
 * The create and edit screens share this hook so validation and navigation can
 * never drift apart between the two flows.
 */
export function useFolktaleDraft({
	initialForm = EMPTY_FOLKTALE_FORM,
	initialSelectedTerms = [],
}: UseFolktaleDraftOptions = {}) {
	const [form, setForm] = useState<FolktaleFormState>(initialForm);
	const [step, setStep] = useState<FolktaleStep>(1);
	const [attempted, setAttempted] = useState<Record<number, boolean>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [selectedGlossaryTerms, setSelectedGlossaryTerms] =
		useState<string[]>(initialSelectedTerms);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const formTopRef = useRef<HTMLDivElement | null>(null);

	const update = <K extends keyof FolktaleFormState>(
		key: K,
		value: FolktaleFormState[K],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const markTouched = (key: string) => {
		setTouched((current) =>
			current[key] ? current : { ...current, [key]: true },
		);
	};

	const markFieldError = (key: string) => {
		markTouched(key);
		setAttempted((current) => ({ ...current, [STORY_STEP]: true }));
	};

	const showError = (key: string, stepNumber: FolktaleStep) =>
		Boolean(touched[key] || attempted[stepNumber]);

	const storyErrors = useMemo(() => getStoryErrors(form), [form]);

	const storyMarker = useMemo(() => findStoryMarker(form.body), [form.body]);

	const characterErrors = useMemo(
		() => getCharacterErrors(form.characters),
		[form.characters],
	);

	const glossaryErrors = useMemo(
		() => getGlossaryErrors(form.glossary, selectedGlossaryTerms),
		[form.glossary, selectedGlossaryTerms],
	);

	const duplicateGlossaryTerms = useMemo(
		() => getDuplicateGlossaryTerms(form.glossary),
		[form.glossary],
	);

	const storyStepValid =
		Object.keys(storyErrors).length === 0 && !storyMarker;

	const charactersStepValid =
		Object.keys(characterErrors).length === 0 &&
		Object.keys(glossaryErrors).length === 0 &&
		duplicateGlossaryTerms.length === 0;

	const isFormValid = storyStepValid && charactersStepValid;

	const scrollToTop = () => {
		formTopRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const goNext = () => {
		const valid =
			step === STORY_STEP
				? storyStepValid
				: step === CHARACTERS_STEP
					? charactersStepValid
					: true;

		if (!valid) {
			setAttempted((current) => ({ ...current, [step]: true }));
			return;
		}

		setStep((current) => Math.min(REVIEW_STEP, current + 1) as FolktaleStep);
		scrollToTop();
	};

	const goBack = () => {
		setStep((current) => Math.max(1, current - 1) as FolktaleStep);
		scrollToTop();
	};

	const selectStep = (next: FolktaleStep) => {
		if (next < step) {
			setStep(next);
			scrollToTop();
		}
	};

	const addTag = () => {
		const value = form.tagInput.trim();
		if (!value) return;

		if (form.tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
			update("tagInput", "");
			return;
		}

		update("tags", [...form.tags, value]);
		update("tagInput", "");
	};

	const handleTagKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Enter" || event.key === ",") {
			event.preventDefault();
			addTag();
			return;
		}
		if (event.key === "Backspace" && !form.tagInput && form.tags.length) {
			update("tags", form.tags.slice(0, -1));
		}
	};

	const addCharacter = () => {
		update("characters", [...form.characters, { ...EMPTY_CHARACTER }]);
	};

	const updateCharacter = (
		index: number,
		patch: Partial<CharacterDraft>,
	) => {
		update(
			"characters",
			form.characters.map((character, currentIndex) =>
				currentIndex === index ? { ...character, ...patch } : character,
			),
		);
	};

	const removeCharacter = (index: number) => {
		update(
			"characters",
			form.characters.filter((_, currentIndex) => currentIndex !== index),
		);
	};

	const addGlossaryEntry = () => {
		update("glossary", [...form.glossary, { ...EMPTY_GLOSSARY }]);
	};

	const updateGlossaryEntry = (
		index: number,
		patch: Partial<GlossaryDraft>,
	) => {
		update(
			"glossary",
			form.glossary.map((entry, currentIndex) =>
				currentIndex === index ? { ...entry, ...patch } : entry,
			),
		);
	};

	const removeGlossaryEntry = (index: number) => {
		update(
			"glossary",
			form.glossary.filter((_, currentIndex) => currentIndex !== index),
		);
	};

	const markGlossaryTermSelected = (term: string) => {
		const normalized = term.trim().toLowerCase();
		if (!normalized) return;
		setSelectedGlossaryTerms((current) =>
			current.includes(normalized) ? current : [...current, normalized],
		);
	};

	const forgetGlossaryTerm = (term: string) => {
		const normalized = term.trim().toLowerCase();
		if (!normalized) return;
		setSelectedGlossaryTerms((current) =>
			current.filter((entry) => entry !== normalized),
		);
	};

	/** Jump to the first step that blocks submission and reveal its errors. */
	const focusFirstInvalidStep = () => {
		setAttempted({ [STORY_STEP]: true, [CHARACTERS_STEP]: true });
		setStep(!storyStepValid ? STORY_STEP : CHARACTERS_STEP);
		scrollToTop();
	};

	const focusStoryBodyError = () => {
		markFieldError("body");
		setStep(STORY_STEP);
		scrollToTop();
	};

	return {
		form,
		setForm,
		update,
		step,
		setStep,
		selectStep,
		goNext,
		goBack,
		touched,
		markTouched,
		showError,
		submitError,
		setSubmitError,
		storyErrors,
		storyMarker,
		characterErrors,
		glossaryErrors,
		duplicateGlossaryTerms,
		selectedGlossaryTerms,
		storyStepValid,
		charactersStepValid,
		isFormValid,
		formTopRef,
		addTag,
		handleTagKeyDown,
		addCharacter,
		updateCharacter,
		removeCharacter,
		addGlossaryEntry,
		updateGlossaryEntry,
		removeGlossaryEntry,
		markGlossaryTermSelected,
		forgetGlossaryTerm,
		focusFirstInvalidStep,
		focusStoryBodyError,
	};
}

export type FolktaleDraftController = ReturnType<typeof useFolktaleDraft>;
