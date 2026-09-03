"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, KeyRound, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useChangeEmailMutation,
  useVerifyChangeEmailMutation,
} from "@/features/auth/api/userEndpoints";
import { extractErrorMessage } from "@/features/auth/lib/errors";
import { usePasswordVisibility } from "@/features/auth/hooks";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { SETTINGS_COLORS as COLORS } from "../constants";

interface ChangeEmailViewProps {
  currentEmail: string;
  onBack: () => void;
  onLogout: () => void;
}

type Step = "email" | "code";

export function ChangeEmailView({
  currentEmail,
  onBack,
  onLogout,
}: ChangeEmailViewProps) {
  const { t } = useTranslation("common");
  const [step, setStep] = useState<Step>("email");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { visible: showPassword, toggle: togglePassword } = usePasswordVisibility();

  const [changeEmail, { isLoading: isSendingCode }] = useChangeEmailMutation();
  const [verifyChangeEmail, { isLoading: isVerifying }] =
    useVerifyChangeEmailMutation();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newEmail.trim()) {
      setError(t("pleaseEnterEmail"));
      return;
    }
    if (newEmail === currentEmail) {
      setError(t("newEmailMustBeDifferent"));
      return;
    }
    if (!currentPassword.trim()) {
      setError(t("pleaseEnterPassword"));
      return;
    }

    try {
      await changeEmail({ newEmail, currentPassword }).unwrap();
      toast.success(t("verificationCodeSent"));
      setStep("code");
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || t("failedToSendCode");
      setError(msg);
      toast.error(msg);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim() || code.length < 4) {
      setError(t("pleaseEnterValidCode"));
      return;
    }

    try {
      await verifyChangeEmail({ newEmail, code }).unwrap();
      toast.success(t("emailChangedSuccessfully"));
      onLogout();
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || t("failedToChangeEmail");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 flex-1 w-full">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium hover:underline w-fit"
        style={{ color: COLORS.secondaryText }}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </button>

      <div className="space-y-1">
        <h2
          className="text-lg sm:text-xl font-semibold"
          style={{ color: COLORS.primaryText }}
        >
          {t("changeEmail")}
        </h2>
        <p className="text-sm" style={{ color: COLORS.secondaryText }}>
          {step === "email"
            ? t("changeEmailDescription")
            : t("enterVerificationCode")}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#0D4D4D]/15 bg-white p-4">
            <p className="text-xs font-medium mb-2" style={{ color: COLORS.secondaryText }}>
              {t("currentEmail")}
            </p>
            <p className="text-sm font-medium" style={{ color: COLORS.primaryText }}>
              {currentEmail}
            </p>
          </div>

          <div>
            <label
              htmlFor="newEmail"
              className="block text-xs font-medium mb-1.5"
              style={{ color: COLORS.secondaryText }}
            >
              {t("newEmail")}
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.secondaryText }}
              />
              <input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#0D4D4D]/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0E808D]/20 transition"
                style={{ color: COLORS.primaryText }}
                placeholder={t("enterNewEmail")}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="emailPassword"
              className="block text-xs font-medium mb-1.5"
              style={{ color: COLORS.secondaryText }}
            >
              {t("currentPassword")}
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.secondaryText }}
              />
              <input
                id="emailPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#0D4D4D]/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0E808D]/20 transition"
                style={{ color: COLORS.primaryText }}
                placeholder={t("enterCurrentPassword")}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                onClick={togglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 rounded-lg border border-[#0D4D4D]/15 text-sm font-medium hover:bg-[#D4E8EA]/30 transition-colors"
              style={{ color: COLORS.primaryText }}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSendingCode || !newEmail.trim() || !currentPassword.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-95 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.accentTeal }}
            >
              {isSendingCode && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("sendCode")}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#0D4D4D]/15 bg-white p-4">
            <p className="text-xs font-medium mb-1" style={{ color: COLORS.secondaryText }}>
              {t("sendingCodeTo")}
            </p>
            <p className="text-sm font-medium" style={{ color: COLORS.primaryText }}>
              {newEmail}
            </p>
          </div>

          <div>
            <label
              htmlFor="code"
              className="block text-xs font-medium mb-1.5"
              style={{ color: COLORS.secondaryText }}
            >
              {t("verificationCode")}
            </label>
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.secondaryText }}
              />
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#0D4D4D]/15 bg-white text-sm tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#0E808D]/20 transition"
                style={{ color: COLORS.primaryText }}
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError("");
              }}
              className="flex-1 py-2.5 rounded-lg border border-[#0D4D4D]/15 text-sm font-medium hover:bg-[#D4E8EA]/30 transition-colors"
              style={{ color: COLORS.primaryText }}
            >
              {t("back")}
            </button>
            <button
              type="submit"
              disabled={isVerifying || code.length < 4}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-95 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.accentTeal }}
            >
              {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("verifyAndChange")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChangeEmailView;
