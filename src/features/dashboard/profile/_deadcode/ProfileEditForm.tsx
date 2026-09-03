@ts-nocheck
// ProfileEditForm.tsx
"use client";

import { useTranslation } from "react-i18next";
import { IconLoader2 } from "@tabler/icons-react";
import { useProfileUpdate } from "../hooks/useProfileUpdate";
import type { ProfileEditFormProps } from "../types";

export function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
	const { t } = useTranslation("common");

	const {
		firstName,
		setFirstName,
		lastName,
		setLastName,
		errors,
		clearError,
		isLoading,
		handleSubmit,
	} = useProfileUpdate({ user, onSuccess: onCancel });

	return (
		<div className="flex flex-col">
			<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-ink/70">
					{t("editPersonalInformation")}
				</h3>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col">
				<div className="px-5 sm:px-6 py-3 border-b border-ink/10">
					<label
						htmlFor="firstName"
						className="text-ink/50 text-sm font-medium mb-2 block"
					>
						{t("firstName")}
					</label>
					<input
						id="firstName"
						type="text"
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							if (errors.firstName) clearError("firstName");
						}}
						disabled={isLoading}
						aria-describedby={errors.firstName ? "firstName-error" : undefined}
						className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
					/>
					{errors.firstName && (
						<p id="firstName-error" className="text-red-500 text-xs mt-1.5">
							{errors.firstName}
						</p>
					)}
				</div>

				<div className="px-5 sm:px-6 py-3">
					<label
						htmlFor="lastName"
						className="text-ink/50 text-sm font-medium mb-2 block"
					>
						{t("lastName")}
					</label>
					<input
						id="lastName"
						type="text"
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							if (errors.lastName) clearError("lastName");
						}}
						disabled={isLoading}
						aria-describedby={errors.lastName ? "lastName-error" : undefined}
						className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
					/>
					{errors.lastName && (
						<p id="lastName-error" className="text-red-500 text-xs mt-1.5">
							{errors.lastName}
						</p>
					)}
				</div>

				<div className="px-5 sm:px-6 py-4 border-t border-ink/10 flex items-center justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="border border-ink/15 text-ink hover:bg-ink/5 active:bg-ink/10 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{t("cancel")}
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="inline-flex items-center justify-center gap-2 bg-brand text-white hover:bg-brand/90 active:bg-brand/95 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
					>
						{isLoading ? (
							<>
								<IconLoader2 className="animate-spin w-4 h-4" />
								<span>{t("saving")}</span>
							</>
						) : (
							t("saveChanges")
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
