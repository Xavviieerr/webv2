import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useVerifyUserMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from "@/features/auth/api/passwordEndpoints";
import { extractErrorMessage } from "@/features/auth/utils/errors";
import { toastSuccessRaw, toastErrorRaw, t } from "@/features/auth/utils/feedback";
import type { ForgotPasswordUser } from "@/features/auth/types";

type Step = 1 | 2 | 3 | 4;

/**
 * State machine for the forgot-password wizard:
 * Step 1: verifyUser (identify account)
 * Step 2: requestPasswordReset (send reset email)
 * Step 3: verifyResetOtp (verify OTP, receive resetToken)
 * Step 4: resetPassword (set new password)
 */
export function useForgotPasswordFlow() {
  const router = useRouter();
  const [verifyUser] = useVerifyUserMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [verifyResetOtp] = useVerifyResetOtpMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [step, setStep] = useState<Step>(1);
  const [user, setUser] = useState<ForgotPasswordUser | null>(null);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goBack = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    setError("");
  }, [step]);

  const goToSignin = useCallback(() => {
    router.push("/signin");
  }, [router]);

  // Step 1: Verify user by email
  const submitEmail = useCallback(
    async (inputEmail: string) => {
      setError("");
      setLoading(true);
      try {
        const data = await verifyUser({ email: inputEmail }).unwrap();
        const found = data as unknown as ForgotPasswordUser;
        setUser(found);
        setEmail(found.email);
        setStep(2);
      } catch (err: unknown) {
        setError(extractErrorMessage(err) || t("userNotFound"));
      } finally {
        setLoading(false);
      }
    },
    [verifyUser],
  );

  // Step 2: Request password reset email
  const requestReset = useCallback(async () => {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset({ email: user.email, userId: user.id }).unwrap();
      setStep(3);
    } catch (err: unknown) {
      setError(extractErrorMessage(err) || t("error"));
    } finally {
      setLoading(false);
    }
  }, [user, requestPasswordReset]);

  // Step 3: Verify OTP, receive resetToken
  const verifyOtpCode = useCallback(
    async (otp: string) => {
      setError("");
      setLoading(true);
      try {
        const result = await verifyResetOtp({ email, otp }).unwrap();
        toastSuccessRaw(result?.message || t("userVerifiedSuccessfully"));
        if (result?.resetToken) {
          setResetToken(result.resetToken);
          setStep(4);
        }
      } catch (err: unknown) {
        const msg = extractErrorMessage(err) || t("invalidOtpPleaseTryAgain");
        setError(msg);
        toastErrorRaw(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, verifyResetOtp],
  );

  // Step 4: Reset password
  const submitNewPassword = useCallback(
    async (password: string, confirmPassword: string) => {
      setError("");
      setLoading(true);
      try {
        await resetPassword({
          email,
          resetToken,
          password,
          confirmPassword,
        }).unwrap();
        toastSuccessRaw(t("passwordResetSuccessfully"));
        router.push("/signin");
      } catch (err: unknown) {
        const msg = extractErrorMessage(err) || t("passwordResetFailed");
        setError(msg);
        toastErrorRaw(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, resetToken, resetPassword, router],
  );

  return {
    step,
    user,
    email,
    loading,
    error,
    setError,
    goBack,
    goToSignin,
    submitEmail,
    requestReset,
    verifyOtpCode,
    submitNewPassword,
  };
}
