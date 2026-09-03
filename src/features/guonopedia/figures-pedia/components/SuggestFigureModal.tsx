"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconX, IconLoader2, IconCheck } from "@tabler/icons-react";
import { useSuggestFigureMutation } from "../api/figureEndpoints";
import {
  suggestFigureSchema,
  OCCUPATION_VALUES,
  type SuggestFigureInput,
} from "../schemas/figureSchema";

interface SuggestFigureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OCCUPATION_LABELS: Record<string, string> = {
  ọseghe: "Ọseghe (Elder/Chief)",
  ọdjonẹ: "Ọdjonẹ (Warrior)",
  ọsoine: "Ọsoine (Leader)",
  ọboine: "Ọboine (Priest)",
  ọyona: "Ọyona (Royalty)",
  activist: "Activist",
  ọchueki: "Ọchueki (Knowledgeable one)",
  academia: "Academia",
  religious: "Religious",
  military: "Military",
  "ovie iku": "Ovie Iku (Ancestral ruler)",
  ovie: "Ovie (Ruler)",
  ọfa: "Ọfa (Diviner)",
};

export function SuggestFigureModal({
  isOpen,
  onClose,
}: SuggestFigureModalProps) {
  const { t } = useTranslation("common");
  const [suggestFigure, { isLoading }] = useSuggestFigureMutation();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<SuggestFigureInput>({
    fullName: "",
    occupation: "" as any,
    shortBio: "",
    introBio: "",
    nationality: "",
    ethnicity: "",
    suggestionNote: "",
  });

  const updateField = (
    field: keyof SuggestFigureInput,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = suggestFigureSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await suggestFigure(result.data).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setForm({
          fullName: "",
          occupation: "" as any,
          shortBio: "",
          introBio: "",
          nationality: "",
          ethnicity: "",
          suggestionNote: "",
        });
      }, 2000);
    } catch {
      setErrors({ submit: "Failed to submit suggestion. Please try again." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#02474F]">
            {t("suggestFigure", "Suggest a Figure")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IconX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-12 px-6">
            <div className="w-12 h-12 rounded-full bg-[#0E808D]/10 flex items-center justify-center">
              <IconCheck className="w-6 h-6 text-[#0E808D]" />
            </div>
            <p className="text-sm font-medium text-[#02474F]">
              {t("suggestionSubmitted", "Suggestion submitted successfully!")}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {t(
                "suggestionPendingReview",
                "Your suggestion will be reviewed by our team.",
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Full Name */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("fullName", "Full Name")} *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="e.g. Socrates"
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Occupation */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("occupation", "Occupation")} *
              </label>
              <select
                value={form.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors"
              >
                <option value="">
                  {t("selectOccupation", "Select occupation...")}
                </option>
                {OCCUPATION_VALUES.map((occ) => (
                  <option key={occ} value={occ}>
                    {OCCUPATION_LABELS[occ] || occ}
                  </option>
                ))}
              </select>
              {errors.occupation && (
                <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
              )}
            </div>

            {/* Short Bio */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("shortBio", "Short Bio")} *
              </label>
              <input
                type="text"
                value={form.shortBio}
                onChange={(e) => updateField("shortBio", e.target.value)}
                placeholder="e.g. Ancient Greek philosopher"
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors"
              />
              {errors.shortBio && (
                <p className="text-red-500 text-xs mt-1">{errors.shortBio}</p>
              )}
            </div>

            {/* Intro Bio */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("introBio", "Introduction")} *
              </label>
              <textarea
                value={form.introBio}
                onChange={(e) => updateField("introBio", e.target.value)}
                rows={3}
                placeholder="Provide a brief introduction about this figure..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none"
              />
              {errors.introBio && (
                <p className="text-red-500 text-xs mt-1">{errors.introBio}</p>
              )}
            </div>

            {/* Nationality */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("nationality", "Nationality")}
              </label>
              <input
                type="text"
                value={form.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                placeholder="e.g. Greek"
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors"
              />
            </div>

            {/* Ethnicity */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("ethnicity", "Ethnicity")}
              </label>
              <input
                type="text"
                value={form.ethnicity}
                onChange={(e) => updateField("ethnicity", e.target.value)}
                placeholder="e.g. Athenian"
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors"
              />
            </div>

            {/* Suggestion Note */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                {t("suggestionNote", "Additional Notes")}
              </label>
              <textarea
                value={form.suggestionNote}
                onChange={(e) => updateField("suggestionNote", e.target.value)}
                rows={2}
                placeholder="Any additional information or context..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {errors.submit && (
              <p className="px-6 py-2 text-red-500 text-xs">{errors.submit}</p>
            )}

            {/* Actions */}
            <div className="px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0E808D] text-white text-sm font-medium hover:bg-[#0E808D]/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    {t("submitting", "Submitting...")}
                  </>
                ) : (
                  t("submitSuggestion", "Submit Suggestion")
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
