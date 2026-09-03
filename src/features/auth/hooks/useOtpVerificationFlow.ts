import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/features/auth/api/authApi";
import { validateOtp } from "@/features/auth/schemas";
import { extractErrorMessage } from "@/features/auth/utils/errors";
import { toastSuccessRaw, toastErrorRaw, t } from "@/features/auth/utils/feedback";

interface OtpState {
  fullOtp: string;
  email: string;
}

/**
 * Orchestrates the signup OTP verification flow:
 * 1. Validate 6-digit OTP
 * 2. Fire verifyOtp mutation
 * 3. Show success, redirect to /signin
 * 4. Supports resend
 */
export function useOtpVerificationFlow() {
  const router = useRouter();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verify = useCallback(
    async ({ fullOtp, email }: OtpState) => {
      setError("");
      setSuccess("");

      const validationError = validateOtp(fullOtp, (k) => t(k));
      if (validationError) {
        setError(validationError);
        return;
      }

      setSubmitting(true);
      try {
        await verifyOtp({ otp: fullOtp, email }).unwrap();
        setSuccess(t("accountVerifiedSuccessfully"));
        setTimeout(() => router.replace("/signin"), 1500);
      } catch (err: unknown) {
        const msg =
          extractErrorMessage(err) || t("invalidOtpPleaseTryAgain");
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [verifyOtp, router],
  );

  const resend = useCallback(
    async (email: string) => {
      setError("");
      setSuccess("");
      try {
        const result = await resendOtp({ email }).unwrap();
        toastSuccessRaw(result?.message || t("otpResentSuccessfully"));
        setSuccess(result?.message || t("otpResentSuccessfully"));
      } catch (err: unknown) {
        const msg =
          extractErrorMessage(err) || t("failedToResendOtp");
        toastErrorRaw(msg);
        setError(msg);
      }
    },
    [resendOtp],
  );

  return { verify, resend, submitting, error, setError, success, setSuccess };
}
