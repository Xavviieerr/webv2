"use client";

import React, { useState } from "react";
import { Shield, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import VerifyUserStep from "@/features/auth/components/VerifyUser";
import RequestResetStep from "@/features/auth/components/RequestResetStep";
import OTPVerificationStep from "@/features/auth/components/OTPVerificationStep";
import SetNewPasswordStep from "@/features/auth/components/SetNewPasswordStep";
import type { ForgotPasswordUser } from "@/features/auth/types";

interface ForgotPasswordCopyFlowProps {
  onClose: () => void;
}

function ForgotPasswordCopyFlow({ onClose }: ForgotPasswordCopyFlowProps) {
  const { t } = useTranslation("common");
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<ForgotPasswordUser | null>(null);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleStep1Complete = (userInfo: ForgotPasswordUser) => {
    setUser(userInfo);
    setEmail(userInfo.email);
    setCurrentStep(2);
  };

  const handleStep2Complete = (userId: string, userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep(3);
  };

  const handleStep3Complete = (token: string) => {
    setResetToken(token);
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <section className="w-full bg-[#D4E8EA] rounded-2xl border border-transparent p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0D4D4D] shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#0D4D4D]">
                {t("changePassword")}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                {t("changePasswordDescription")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[#0D4D4D]/70 hover:text-[#0D4D4D] hover:bg-[#0D4D4D]/10 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>{t("cancel")}</span>
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  step <= currentStep ? "bg-[#0D4D4D]" : "bg-[#0D4D4D]/20"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {currentStep === 1 && (
            <VerifyUserStep onNext={handleStep1Complete} onClose={onClose} />
          )}

          {currentStep === 2 && (
            <RequestResetStep
              user={user}
              onNext={handleStep2Complete}
              onClose={onClose}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <OTPVerificationStep
              email={email as string}
              userId={user?.id as string}
              onNext={handleStep3Complete}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <SetNewPasswordStep
              email={email}
              resetToken={resetToken}
              onBack={handleBack}
              onClose={onClose}
            />
          )}
        </div>

      </section>
    </div>
  );
}

export default ForgotPasswordCopyFlow;
