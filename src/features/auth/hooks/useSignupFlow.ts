import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/features/auth/api/authApi";
import { signupFullSchema } from "@/features/auth/schemas";
import { session } from "@/features/auth/services/session";
import { extractErrorMessage } from "@/features/auth/utils/errors";
import { t } from "@/features/auth/utils/feedback";

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  DOB: string;
  province?: string;
  town?: string;
  provinceName?: string;
  townName?: string;
}

/**
 * Orchestrates the signup flow:
 * 1. Validate all fields via signupFullSchema
 * 2. Persist email to session (for verify-otp fallback)
 * 3. Fire register mutation
 * 4. Redirect to /verify-otp on success
 * 5. Show toast on error
 */
export function useSignupFlow() {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const signupFlow = useCallback(
    async (data: SignupData) => {
      setError("");

      const validation = signupFullSchema.safeParse({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        DOB: data.DOB,
        province: data.province,
        town: data.town,
      });

      if (!validation.success) {
        setError(validation.error.issues[0].message);
        return;
      }

      setSubmitting(true);
      session.saveSignupContext({ email: data.email });

      try {
        await register({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
          gender: data.gender,
          deviceType: "browser",
          platform: "web",
          DOB: data.DOB,
          ...(data.provinceName ? { province: data.provinceName } : {}),
          ...(data.townName ? { town: data.townName } : {}),
        }).unwrap();
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } catch (err: unknown) {
        setSubmitting(false);
        const msg = extractErrorMessage(err) || t("registrationFailed");
        setError(msg);
      }
    },
    [register, router],
  );

  return { signupFlow, submitting, error, setError };
}
