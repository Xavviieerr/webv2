"use client";

import { useTranslation } from "react-i18next";
import { IconLoader2 } from "@tabler/icons-react";
import { useUnifiedProfileUpdate } from "../hooks/useUnifiedProfileUpdate";
import type { ProfileEditFormProps } from "../types";

export function UnifiedProfileForm({ user, onCancel }: ProfileEditFormProps) {
  const { t } = useTranslation("common");

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    gender,
    setGender,
    provinceId,
    setProvinceId,
    townId,
    setTownId,
    provinces,
    towns,
    errors,
    clearError,
    isLoading,
    handleSubmit,
  } = useUnifiedProfileUpdate({ user, onSuccess: onCancel });

  return (
    <div className="flex flex-col">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0D4D4D]/70">
          {t("editPersonalInformation")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label htmlFor="firstName" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
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
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
          />
          {errors.firstName && (
            <p id="firstName-error" className="text-red-500 text-xs mt-1.5">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label htmlFor="lastName" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
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
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
          />
          {errors.lastName && (
            <p id="lastName-error" className="text-red-500 text-xs mt-1.5">
              {errors.lastName}
            </p>
          )}
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label htmlFor="username" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
            {t("username")}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) clearError("username");
            }}
            disabled={isLoading}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
          />
          {errors.username && (
            <p id="username-error" className="text-red-500 text-xs mt-1.5">
              {errors.username}
            </p>
          )}
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label htmlFor="gender" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
            {t("gender")}
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
          >
            <option value="">{t("selectGender")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label htmlFor="province" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
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
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors capitalize"
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
          <label htmlFor="town" className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">
            {t("town")}
          </label>
          <select
            id="town"
            value={townId}
            onChange={(e) => setTownId(e.target.value)}
            disabled={isLoading || !provinceId}
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3.5 py-2 text-sm text-[#0D4D4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors capitalize"
          >
            <option value="">{t("selectTown")}</option>
            {towns.map((twn) => (
              <option key={twn.id ?? twn.name} value={(twn.id ?? twn.name)?.toString().trim() ?? twn.name.trim()}>
                {twn.name.trim()}
              </option>
            ))}
          </select>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-[#0D4D4D]/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="border border-[#0D4D4D]/15 text-[#0D4D4D] hover:bg-[#0D4D4D]/5 active:bg-[#0D4D4D]/10 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 bg-[#0E808D] text-white hover:bg-[#0E808D]/90 active:bg-[#0E808D]/95 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
