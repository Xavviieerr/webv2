"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useUpdateUserNameMutation } from "@/slice/userEndpoints";
import { usernameUpdateSchema } from "../schemas/profileSchema";
import type { User } from "@/types";

interface UseUsernameUpdateParams {
  user: User;
  onSuccess: () => void;
}

export function useUsernameUpdate({ user, onSuccess }: UseUsernameUpdateParams) {
  const [username, setUsername] = useState(user.username ?? "");
  const [errors, setErrors] = useState<{ username?: string }>({});

  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();

  const validate = useCallback((): boolean => {
    const result = usernameUpdateSchema.safeParse({ username });

    if (result.success) {
      setErrors({});
      return true;
    }

    const next: typeof errors = {};
    for (const issue of result.error.issues) {
      if (issue.path[0] === "username") {
        next.username = issue.message;
      }
    }

    setErrors(next);
    return false;
  }, [username]);

  const clearError = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await updateUserName({ username }).unwrap();
        toast.success("Username updated");
        onSuccess();
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const rawMsg = (err as { data?: { message?: string } })?.data?.message;

        if (status === 409) {
          setErrors({ username: "Username already taken" });
        } else {
          toast.error(rawMsg || "Failed to update username");
        }
      }
    },
    [username, validate, updateUserName, onSuccess],
  );

  return {
    username,
    setUsername,
    errors,
    clearError,
    isLoading,
    handleSubmit,
  };
}
