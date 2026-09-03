"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/types/hooks";
import { useDeleteUserMutation } from "@/slice/userEndpoints";
import { logoutHandler } from "@/features/auth";
import { toast } from "react-hot-toast";
import type { User as AppUser } from "@/types";

function DeleteAccountView({
  user,
  onCancel,
}: {
  user: AppUser | null | undefined;
  onCancel: () => void;
}) {
  const { t } = useTranslation("common");
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.trim() !== "DELETE") {
      toast.error(t("pleaseTypeDeleteToConfirm"));
      return;
    }
    if (!user?.id) {
      toast.error(t("unableToDeleteAccount"));
      return;
    }
    try {
      await deleteUser(user.id).unwrap();
      toast.success(t("accountDeleted"));
      logoutHandler();
      router.push("/signin");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? t("failedToDeleteAccount");
      toast.error(msg);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-auto flex-1 w-full max-w-2xl mx-auto">
      <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-5">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-100 shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#C14A4A]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#C14A4A]">{t("deleteAccount")}</p>
          <p className="text-xs sm:text-sm text-[#C14A4A]/80 leading-relaxed">
            {t("deleteAccountIrreversibleWarning")}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white rounded-2xl border border-[#0D4D4D]/10 p-5 sm:p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#0D4D4D]">
            {t("typeDeleteToConfirm")}
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full h-12 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C14A4A] placeholder:text-red-300 placeholder:font-medium placeholder:tracking-[0.2em] outline-none focus:ring-2 focus:ring-[#C14A4A]/20 focus:border-[#C14A4A]/50 transition-all"
            placeholder="DELETE"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            className="w-full sm:w-1/2 py-2.5 rounded-lg border border-[#0D4D4D]/15 text-sm font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/30 transition-colors"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading || confirmText.trim() !== "DELETE"}
            className="w-full sm:w-1/2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-[#A93A3A] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#C14A4A" }}
          >
            {isLoading ? t("deleting") : t("deleteMyAccount")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeleteAccountView;
