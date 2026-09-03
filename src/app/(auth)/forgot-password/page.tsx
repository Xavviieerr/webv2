"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneLayout from "@/components/layouts/PhoneLayout";
import VerifyUserStep from "@/features/auth/components/VerifyUser";
import RequestResetStep from "@/features/auth/components/RequestResetStep";
import OTPVerificationStep from "@/features/auth/components/OTPVerificationStep";
import SetNewPasswordStep from "@/features/auth/components/SetNewPasswordStep";
import Logo from "@/components/ui/Logo";
import { useLanguageSync } from "@/features/auth/hooks";
import type { ForgotPasswordUser } from "@/features/auth/types";
import { TEAL } from "@/features/auth/constants";

export default function ForgotPassword() {
  const { t, i18n } = useLanguageSync();
  const router = useRouter();
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

  const handleStep3Complete = (resetToken: string) => {
    setResetToken(resetToken);
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 4) setCurrentStep(3);
  };

  const handleClose = () => {
    router.push("/signin");
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen h-screen overflow-hidden">
      <aside className="min-h-0 overflow-hidden">
        <PhoneLayout />
      </aside>

      <section className="flex flex-col items-center justify-center bg-white py-8 px-4 sm:px-6 w-full min-h-0 overflow-y-auto">
        <div className="relative w-full max-w-[634px]">
          {currentStep === 1 && (
            <div className="mb-6">
              <Logo type="normal" />
            </div>
          )}

          <div className="w-full">
            {currentStep === 1 && (
              <VerifyUserStep key="step1" onNext={handleStep1Complete} onClose={handleClose} />
            )}
            {currentStep === 2 && (
              <RequestResetStep
                key="step2"
                user={user}
                onNext={handleStep2Complete}
                onClose={handleClose}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <OTPVerificationStep
                key="step3"
                email={email as string}
                userId={user?.id as string}
                onNext={handleStep3Complete}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <SetNewPasswordStep
                key="step4"
                email={email}
                resetToken={resetToken}
                onBack={handleBack}
                onClose={handleClose}
              />
            )}
          </div>

          <div className="text-center text-sm text-black mt-6">
            {t("backTo")}{" "}
            <Link href="/signin" className="font-medium hover:underline" style={{ color: TEAL }}>
              {t("login")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
