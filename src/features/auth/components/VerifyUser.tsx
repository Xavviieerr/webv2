import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";
import { useVerifyUserMutation } from "@/features/auth/api/passwordEndpoints";
import type { ForgotPasswordUser } from "@/features/auth/types";
import { validateEmail } from "@/features/auth/schemas";
import { extractErrorMessage } from "@/features/auth/lib/errors";
import { useTranslation } from "react-i18next";

interface VerifyUserStepProps {
  onNext: (user: ForgotPasswordUser) => void;
  onClose: () => void;
  onBack?: () => void;
}

const VerifyUserStep: React.FC<VerifyUserStepProps> = ({ onNext, onBack }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const [verifyUserMutation, { isLoading }] = useVerifyUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(t(validationError));
      return;
    }

    setError("");

    try {
      const result = await verifyUserMutation({ email: email.trim() }).unwrap();
      const data = result as { message?: string; userInfo?: ForgotPasswordUser };
      toast.success(data?.message || t("userVerifiedSuccessfully"));
      if (data?.userInfo) onNext(data.userInfo);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || t("error");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-center mb-4 sm:mb-5 md:mb-6">
        <p className="text-xs sm:text-sm text-[#05353A]/70 break-words">
          {t("enterEmailToVerify")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className="w-full p-2.5 sm:p-3 rounded-xl border text-sm sm:text-base text-[#05353A] border-[#05353A]/20 focus:outline-none focus:ring-1 focus:ring-[#05353A]"
            placeholder=""
            required
          />
          {error && <p className="text-red-500 text-xs sm:text-sm mt-1 break-words">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:space-x-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 border border-[#05353A] text-[#05353A] rounded-lg text-sm sm:text-base font-medium hover:bg-[#05353A]/10 transition-colors"
            >
              {t("back")}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${onBack
                ? "flex-1 bg-[#05353A] text-white hover:bg-[#05353A]/90"
                : "w-full bg-[#05353A] text-white hover:bg-[#05353A]/90"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                {t("verifying")}
                <RiLoader2Fill className="animate-spin ml-2 text-base sm:text-lg" />
              </span>
            ) : (
              <p>{t("verifyUser")}</p>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyUserStep;
