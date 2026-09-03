import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/features/auth/api/passwordEndpoints";
import { Lock } from "lucide-react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { usePasswordVisibility } from "@/features/auth/hooks";
import { validateResetPassword } from "@/features/auth/schemas";
import { extractErrorMessage } from "@/features/auth/lib/errors";
import { logoutHandler } from "@/features/auth/lib/logoutHandler";
import { TEAL, BORDER_GRAY, TEXT_GRAY } from "@/features/auth/constants";
import { getPasswordStrength } from "@/lib/helpers";

interface SetNewPasswordStepProps {
  email: string;
  resetToken: string;
  onBack: () => void;
  onClose: () => void;
}

const SetNewPasswordStep: React.FC<SetNewPasswordStepProps> = ({ email, resetToken, onBack, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { visible: showPassword, toggle: togglePassword } = usePasswordVisibility();
  const { visible: showConfirmPassword, toggle: toggleConfirmPassword } = usePasswordVisibility();
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const router = useRouter();
  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateResetPassword(password, confirmPassword);
    if (validationError) {
      setError(t(validationError));
      return;
    }

    setError("");

    try {
      await resetPasswordMutation({
        email,
        resetToken: resetToken || null,
        password,
        confirmPassword,
      }).unwrap();
      toast.success(t("passwordResetSuccessfully"));
      logoutHandler();
      router.push("/login");
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || t("failedToResetPassword");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-black hover:underline mb-4"
          style={{ color: TEXT_GRAY }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          {t("createNewPassword")}
        </h2>
        <p className="text-sm sm:text-base font-normal" style={{ color: TEXT_GRAY }}>
          {t("forgotPasswordDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: TEXT_GRAY }}
            />
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full pl-10 pr-12 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
              style={{ borderColor: BORDER_GRAY }}
              placeholder={t("enterNewPassword")}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      level <= passwordStrength.level
                        ? passwordStrength.color
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${
                  passwordStrength.level >= 4
                    ? "text-green-600"
                    : passwordStrength.level >= 3
                      ? "text-blue-600"
                      : passwordStrength.level >= 2
                        ? "text-yellow-600"
                        : "text-red-600"
                }`}
              >
                {t(passwordStrength.textKey || "veryWeak")}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: TEXT_GRAY }}
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? "border-green-500 focus:ring-green-500/20"
                    : "border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
              style={{
                borderColor: confirmPassword.length > 0
                  ? passwordsMatch
                    ? "#10b981"
                    : "#ef4444"
                  : BORDER_GRAY,
              }}
              placeholder={t("confirmPassword")}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              onClick={toggleConfirmPassword}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">{t("passwordsDoNotMatch")}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || password.length < 8}
          className="w-full py-3 rounded-lg text-white text-base font-bold hover:opacity-95 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: TEAL }}
        >
          {isLoading ? (
            <>
              <RiLoader2Fill className="animate-spin w-5 h-5" />
              <span>{t("submitting")}</span>
            </>
          ) : (
            t("resetPassword")
          )}
        </button>
      </form>
    </div>
  );
};

export default SetNewPasswordStep;
