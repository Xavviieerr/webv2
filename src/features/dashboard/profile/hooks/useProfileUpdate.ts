"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useUpdateProfileMutation } from "@/slice/userEndpoints";
import { profileUpdateSchema } from "../schemas/profileSchema";
import type { User } from "@/types";

interface UseProfileUpdateParams {
  user: User;
  onSuccess: () => void;
}

export function useProfileUpdate({ user, onSuccess }: UseProfileUpdateParams) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const reduxUser = useAppSelector((state) => state.auth.user);

  const validate = useCallback((): boolean => {
    const result = profileUpdateSchema.safeParse({ firstName, lastName });

    if (result.success) {
      setErrors({});
      return true;
    }

    const next: typeof errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      const msg = issue.message;
      if (field === "firstName") next.firstName = msg;
      else if (field === "lastName") next.lastName = msg;
    }

    setErrors(next);
    return false;
  }, [firstName, lastName]);

  const clearError = useCallback((field: "firstName" | "lastName") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await updateProfile({
          firstName,
          lastName,
          gender: reduxUser?.gender || undefined,
          DOB: reduxUser?.DOB || undefined,
          province: reduxUser?.province || undefined,
          town: reduxUser?.town || undefined,
          profilePictureUrl: reduxUser?.profilePictureUrl || undefined,
        }).unwrap();
        toast.success("Profile updated");
        onSuccess();
      } catch (err: unknown) {
        const rawMsg = (err as { data?: { message?: string } })?.data?.message;
        toast.error(rawMsg || "Failed to update profile");
      }
    },
    [firstName, lastName, validate, updateProfile, onSuccess, reduxUser],
  );

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    errors,
    clearError,
    isLoading,
    handleSubmit,
  };
}
