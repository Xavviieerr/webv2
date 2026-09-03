import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/api/authApi";
import { validateLoginIdentifier, validateLoginPassword } from "@/features/auth/schemas";
import { extractErrorMessage } from "@/features/auth/utils/errors";
import { t } from "@/features/auth/utils/feedback";

interface LoginState {
  identifier: string;
  password: string;
  stayLoggedIn: boolean;
}

/**
 * Orchestrates the login flow:
 * 1. Validate identifier + password
 * 2. Fire login mutation
 * 3. Redirect to /search on success
 * 4. Show translated toast on error
 *
 * Does NOT own storage — authApi.onQueryStarted handles persistence.
 */
export function useLoginFlow() {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = useCallback((state: LoginState): boolean => {
    const next: typeof errors = {};
    const idErr = validateLoginIdentifier(state.identifier);
    if (idErr) next.identifier = idErr;
    const pwErr = validateLoginPassword(state.password);
    if (pwErr) next.password = pwErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  }, []);

  const loginFlow = useCallback(
    async (state: LoginState) => {
      if (!validate(state)) return;

      setSubmitting(true);
      try {
        await login({
          identifier: state.identifier,
          password: state.password,
          stayLoggedIn: state.stayLoggedIn,
        }).unwrap();
        router.replace("/search");
      } catch (err: unknown) {
        const msg = extractErrorMessage(err) || t("loginFailed");
        setErrors({ identifier: msg });
      } finally {
        setSubmitting(false);
      }
    },
    [login, router, validate],
  );

  return { loginFlow, submitting, errors, setErrors };
}
