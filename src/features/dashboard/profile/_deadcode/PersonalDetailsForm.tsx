@ts-nocheck
// PersonalDetailsForm.tsx
"use client";

import { useTranslation } from "react-i18next";
import { IconLoader2 } from "@tabler/icons-react";
import { usePersonalDetailsUpdate } from "../hooks/usePersonalDetailsUpdate";
import type { PersonalDetailsFormProps } from "../types";

export function PersonalDetailsForm({ user, onCancel }: PersonalDetailsFormProps) {
  const { t } = useTranslation("common");

  const {
    gender,
    setGender,
    dob,
    setDob,
    provinceId,
    setProvinceId,
    townId,
    setTownId,
    provinces,
    towns,
    errors,
    isLoading,
    handleSubmit,
  } = usePersonalDetailsUpdate({ user, onSuccess: onCancel });

  return (
    <div className="flex flex-col">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/70">
          {t("editPersonalDetails")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-5 sm:px-6 py-3 border-b border-ink/10">
          <label htmlFor="gender" className="text-ink/50 text-sm font-medium mb-2 block">
            {t("gender")}
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
          >
            <option value="">{t("selectGender")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-ink/10">
          <label htmlFor="dob" className="text-ink/50 text-sm font-medium mb-2 block">
            {t("dateOfBirth")}
          </label>
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
          />
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-ink/10">
          <label htmlFor="province" className="text-ink/50 text-sm font-medium mb-2 block">
            {t("province")}
          </label>
          <select
            id="province"
            value={provinceId}
            onChange={(e) => {
              setProvinceId(e.target.value);
              setTownId("");
            }}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors capitalize"
          >
            <option value="">{t("selectProvince")}</option>
            {provinces.map((p) => (
              <option key={p.id ?? p.name} value={(p.id ?? p.name)?.toString().trim() ?? ""}>
                {p.name.trim()}
              </option>
            ))}
          </select>
        </div>

        <div className="px-5 sm:px-6 py-3">
          <label htmlFor="town" className="text-ink/50 text-sm font-medium mb-2 block">
            {t("town")}
          </label>
          <select
            id="town"
            value={townId}
            onChange={(e) => setTownId(e.target.value)}
            disabled={isLoading || !provinceId}
            className="w-full h-11 rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors capitalize"
          >
            <option value="">{t("selectTown")}</option>
            {towns.map((twn) => (
              <option key={twn.id ?? twn.name} value={(twn.id ?? twn.name)?.toString().trim() ?? twn.name.trim()}>
                {twn.name.trim()}
              </option>
            ))}
          </select>
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
