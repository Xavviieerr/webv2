import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { toast } from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";
import { useVerifyResetOtpMutation, useRequestPasswordResetMutation } from "@/features/auth/api/passwordEndpoints";
import { useOtpInput } from "@/features/auth/hooks";
import { useTranslation } from "react-i18next";

interface OTPVerificationStepProps {
  email: string;
  userId: string;
  onNext: (resetToken: string) => void;
  onBack: () => void;
}

const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({
  email,
  userId,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const { otp, inputRefs, handleChange, handleKeyDown, handlePaste, getFullOtp } = useOtpInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = getFullOtp();
    if (fullOtp.length !== 6) {
      setError(t("pleaseEnter6digitCode"));
      return;
    }

    setError("");

    try {
      const result = await verifyResetOtp({ email, otp: fullOtp }).unwrap();
      toast.success(result?.message || t("userVerifiedSuccessfully"));
      if (result?.resetToken) onNext(result.resetToken);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || t("invalidOtpPleaseTryAgain");
      setError(msg);
      toast.error(msg);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      await requestPasswordReset({ email, userId }).unwrap();
      toast.success(t("resetEmailSentSuccessfully"));
    } catch {
      toast.error(t("error"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-[#05353A] hover:text-[#05353A]/80 transition-colors mr-3"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[#05353A]">{t("verifyCode")}</h2>
          <p className="text-sm text-[#05353A]/70">
            {t("enter6digitCode")} {email}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#05353A] mb-3">
            {t("verificationCode")}
          </label>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value, () => setError(""))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, () => setError(""))}
                maxLength={1}
                className="w-12 h-12 text-center text-[#05353A] text-lg rounded-lg border border-[#05353A]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#05353A]"
                inputMode="numeric"
                pattern="\d"
                required
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-[#05353A] text-sm hover:underline disabled:opacity-50"
          >
            {t("resendVerificationCode")}? {t("resend")}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || getFullOtp().length !== 6}
          className="bg-[#05353A] text-white py-3 px-6 w-full rounded-lg font-medium hover:bg-[#05353A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              {t("verifying")}
              <RiLoader2Fill className="animate-spin ml-2" />
            </span>
          ) : (
            <p>{t("verifyCode")}</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default OTPVerificationStep;
