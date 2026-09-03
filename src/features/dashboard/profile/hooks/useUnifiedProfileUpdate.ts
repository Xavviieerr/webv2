"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useUpdateProfileMutation, useUpdateUserNameMutation } from "@/slice/userEndpoints";
import {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} from "@/features/auth/api/provinceEndpoints";
import { profileUpdateSchema, usernameUpdateSchema, personalDetailsSchema } from "../schemas/profileSchema";
import type { PersonalDetailsValues } from "../schemas/profileSchema";
import type { User } from "@/types";

interface UseUnifiedProfileUpdateParams {
  user: User;
  onSuccess: () => void;
}

export function useUnifiedProfileUpdate({ user, onSuccess }: UseUnifiedProfileUpdateParams) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [gender, setGender] = useState<string>(user?.gender ?? "");
  const [dob, setDob] = useState<string>(user?.DOB ?? "");
  const [provinceId, setProvinceId] = useState<string>("");
  const [townId, setTownId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [updateProfile, { isLoading: isProfileLoading }] = useUpdateProfileMutation();
  const [updateUserName, { isLoading: isUsernameLoading }] = useUpdateUserNameMutation();
  const reduxUser = useAppSelector((state) => state.auth.user);

  const isLoading = isProfileLoading || isUsernameLoading;

  const { data: provincesData } = useGetProvincesQuery();
  const provinces = useMemo(() => provincesData?.data ?? [], [provincesData]);

  useEffect(() => {
    if (user?.province && provinces.length > 0 && !provinceId) {
      const match = provinces.find(
        (p) => p.name.toLowerCase() === user.province!.toLowerCase(),
      );
      if (match) {
        setProvinceId(match.id ?? match.name);
      }
    }
  }, [user?.province, provinces, provinceId]);

  const { data: townsData } = useGetTownsByProvinceIdQuery(provinceId, {
    skip: !provinceId,
  });
  const towns = useMemo(() => townsData?.data ?? [], [townsData]);

  useEffect(() => {
    if (user?.town && towns.length > 0 && !townId) {
      const match = towns.find(
        (t) => t.name.toLowerCase() === user.town!.toLowerCase(),
      );
      if (match) {
        setTownId(match.id ?? match.name);
      }
    }
  }, [user?.town, towns, townId]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const profileResult = profileUpdateSchema.safeParse({ firstName, lastName });
      const usernameResult = usernameUpdateSchema.safeParse({ username });

      const provinceName = provinceId
        ? (provinces.find((p) => (p.id ?? p.name) === provinceId)?.name ?? undefined)
        : undefined;
      const townName = townId
        ? (towns.find((t) => (t.id ?? t.name) === townId)?.name ?? undefined)
        : undefined;

      const personalValues: PersonalDetailsValues = {
        gender: gender || undefined,
        DOB: dob || undefined,
        province: provinceName,
        town: townName,
      };
      const personalResult = personalDetailsSchema.safeParse(personalValues);

      const fieldErrors: Record<string, string> = {};
      if (!profileResult.success) {
        for (const issue of profileResult.error.issues) {
          const field = issue.path[0] as string;
          if (field) fieldErrors[field] = issue.message;
        }
      }
      if (!usernameResult.success) {
        for (const issue of usernameResult.error.issues) {
          const field = issue.path[0] as string;
          if (field) fieldErrors[field] = issue.message;
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      try {
        await updateProfile({
          firstName,
          lastName,
          gender: personalResult.success ? personalResult.data.gender : reduxUser?.gender || undefined,
          DOB: personalResult.success ? personalResult.data.DOB : reduxUser?.DOB || undefined,
          province: personalResult.success ? personalResult.data.province : reduxUser?.province || undefined,
          town: personalResult.success ? personalResult.data.town : reduxUser?.town || undefined,
          profilePictureUrl: reduxUser?.profilePictureUrl || undefined,
        }).unwrap();

        if (username !== (user.username ?? "")) {
          await updateUserName({ username }).unwrap();
        }

        toast.success("Profile updated");
        onSuccess();
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const rawMsg = (err as { data?: { message?: string } })?.data?.message;

        if (status === 409) {
          setErrors({ username: "Username already taken" });
        } else {
          toast.error(rawMsg || "Failed to update profile");
        }
      }
    },
    [
      firstName, lastName, username, gender, dob, provinceId, townId,
      provinces, towns, updateProfile, updateUserName, onSuccess, reduxUser, user.username,
    ],
  );

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    gender,
    setGender,
    provinceId,
    setProvinceId,
    townId,
    setTownId,
    provinces,
    towns,
    errors,
    clearError,
    isLoading,
    handleSubmit,
  };
}
