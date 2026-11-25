"use client";

import { useState } from "react";
import {
	useCreateFolktaleCharacterMutation,
	useCreateFolktaleGlossaryMutation,
	useDeleteFolktaleCharacterMutation,
	useDeleteFolktaleGlossaryMutation,
	useUpdateFolktaleCharacterMutation,
	useUpdateFolktaleGlossaryMutation,
	useUpdateFolktaleMutation,
} from "../api/folktaleEndpoints";
import type { FolktaleDetail } from "../types/folktales";
import {
	buildCharacterPayload,
	buildFolktalePayload,
	buildGlossaryPayload,
} from "./payload";
import type { CharacterDraft, FolktaleFormState, GlossaryDraft } from "./types";

function isSameCharacter(
	existing: NonNullable<FolktaleDetail["characters"]>[number],
	draft: CharacterDraft,
	order: number,
): boolean {
	return (
		existing.name === draft.name.trim() &&
		(existing.localName ?? "") === draft.localName.trim() &&
		(existing.role ?? "") === draft.role.trim() &&
		(existing.description ?? "") === draft.description.trim() &&
		existing.order === order
	);
}

function isSameGlossaryEntry(
	existing: NonNullable<FolktaleDetail["glossary"]>[number],
	draft: GlossaryDraft,
	order: number,
): boolean {
	return (
		existing.term === draft.term.trim() &&
		(existing.pronunciation ?? "") === draft.pronunciation.trim() &&
		existing.order === order
	);
}

/**
 * Persists an edited draft. The story is updated first, then character and
 * glossary collections are reconciled one record at a time so the API never
 * receives nested writes it does not own.
 */
export function useFolktaleEditor() {
	const [isSaving, setIsSaving] = useState(false);

	const [updateFolktale] = useUpdateFolktaleMutation();
	const [createCharacter] = useCreateFolktaleCharacterMutation();
	const [updateCharacter] = useUpdateFolktaleCharacterMutation();
	const [deleteCharacter] = useDeleteFolktaleCharacterMutation();
	const [createGlossary] = useCreateFolktaleGlossaryMutation();
	const [updateGlossary] = useUpdateFolktaleGlossaryMutation();
	const [deleteGlossary] = useDeleteFolktaleGlossaryMutation();

	const syncCharacters = async (
		folktale: FolktaleDetail,
		state: FolktaleFormState,
	) => {
		const existing = folktale.characters ?? [];
		const keptIds = new Set(
			state.characters
				.map((character) => character.id)
				.filter((id): id is string => Boolean(id)),
		);

		for (const character of existing) {
			if (character.id && !keptIds.has(character.id)) {
				await deleteCharacter({
					folktaleId: folktale.id,
					characterId: character.id,
				}).unwrap();
			}
		}

		const nextCharacters = state.characters.filter((character) =>
			character.name.trim(),
		);

		for (const [index, character] of nextCharacters.entries()) {
			const order = index + 1;
			const payload = buildCharacterPayload(character, order);

			if (!character.id) {
				await createCharacter({
					folktaleId: folktale.id,
					body: payload,
				}).unwrap();
				continue;
			}

			const current = existing.find(
				(item) => item.id === character.id,
			);
			if (current && !isSameCharacter(current, character, order)) {
				await updateCharacter({
					folktaleId: folktale.id,
					characterId: character.id,
					body: payload,
				}).unwrap();
			}
		}
	};

	const syncGlossary = async (
		folktale: FolktaleDetail,
		state: FolktaleFormState,
	) => {
		const existing = folktale.glossary ?? [];
		const keptIds = new Set(
			state.glossary
				.map((entry) => entry.id)
				.filter((id): id is string => Boolean(id)),
		);

		for (const entry of existing) {
			if (entry.id && !keptIds.has(entry.id)) {
				await deleteGlossary({
					folktaleId: folktale.id,
					glossaryId: entry.id,
				}).unwrap();
			}
		}

		const nextGlossary = state.glossary.filter((entry) =>
			entry.term.trim(),
		);

		for (const [index, entry] of nextGlossary.entries()) {
			const order = index + 1;
			const payload = buildGlossaryPayload(entry, order);

			if (!entry.id) {
				await createGlossary({
					folktaleId: folktale.id,
					body: payload,
				}).unwrap();
				continue;
			}

			const current = existing.find((item) => item.id === entry.id);
			if (current && !isSameGlossaryEntry(current, entry, order)) {
				await updateGlossary({
					folktaleId: folktale.id,
					glossaryId: entry.id,
					body: payload,
				}).unwrap();
			}
		}
	};

	const save = async (
		folktale: FolktaleDetail,
		state: FolktaleFormState,
	) => {
		setIsSaving(true);
		try {
			await updateFolktale({
				folktaleId: folktale.id,
				body: buildFolktalePayload(state),
			}).unwrap();
			await syncCharacters(folktale, state);
			await syncGlossary(folktale, state);
		} finally {
			setIsSaving(false);
		}
	};

	return { save, isSaving };
}
