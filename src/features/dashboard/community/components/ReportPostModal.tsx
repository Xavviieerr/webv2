"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useFlagPostMutation } from "../api/communityEndpoints";
import { IconX, IconLoader2, IconFlag } from "@tabler/icons-react";

interface ReportPostModalProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

const REPORT_REASONS = [
  "spam",
  "harassment",
  "misinformation",
  "inappropriate",
  "other",
] as const;

export function ReportPostModal({ isOpen, postId, onClose }: ReportPostModalProps) {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);
  const [flagPost, { isLoading }] = useFlagPostMutation();
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reason || !description.trim() || !user?.id) return;

      try {
        await flagPost({
          reporterId: user.id,
          targetType: "post",
          targetId: postId,
          reason,
          description,
        }).unwrap();
        toast.success(t("reportSubmitted", "Report submitted. Thank you for helping keep our community safe."));
        setReason("");
        setDescription("");
        onClose();
      } catch {
        toast.error(t("failedToSubmitReport", "Failed to submit report"));
      }
    },
    [flagPost, postId, reason, description, user?.id, t, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-md mx-4">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10">
          <div className="flex items-center gap-2">
            <IconFlag className="w-4 h-4 text-[#0E808D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
              {t("reportPost", "Report Post")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#0D4D4D]/50 transition-colors hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D]"
          >
            <IconX className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
            <label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">
              {t("reason", "Reason")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors capitalize ${
                    reason === r
                      ? "border-[#0E808D] bg-[#0E808D]/10 text-[#0E808D]"
                      : "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"
                  }`}
                >
                  {t(r, r)}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3">
            <label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">
              {t("description", "Description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t("reportDescriptionPlaceholder", "Please provide more details about your report...")}
              className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[80px]"
            />
          </div>

          <div className="px-5 sm:px-6 py-4 flex items-center justify-end gap-3 border-t border-[#0D4D4D]/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-2 text-sm font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50"
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason || !description.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="animate-spin w-4 h-4" />
                  {t("submitting", "Submitting...")}
                </>
              ) : (
                t("submitReport", "Submit Report")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
