@ts-nocheck
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import { useUpdateProfileMutation } from "@/slice/userEndpoints";
import {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} from "@/features/auth/api/provinceEndpoints";
import { personalDetailsSchema } from "../schemas/profileSchema";
import type { PersonalDetailsValues } from "../schemas/profileSchema";
import type { User as AppUser } from "@/types";

interface UsePersonalDetailsUpdateProps {
  user: AppUser;
  onSuccess: () => void;
}

export function usePersonalDetailsUpdate({
  user,
  onSuccess,
}: UsePersonalDetailsUpdateProps) {
  const [gender, setGender] = useState<string>(user?.gender ?? "");
  const [dob, setDob] = useState<string>(user?.DOB ?? "");
  const [provinceId, setProvinceId] = useState<string>("");
  const [townId, setTownId] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetailsValues, string>>>({});

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const reduxUser = useAppSelector((state) => state.auth.user);

  const { data: provincesData } = useGetProvincesQuery();
  const provinces = useMemo(() => provincesData?.data ?? [], [provincesData]);

  // Resolve user's province name to ID on load
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

  // Fetch towns based on selected provinceId
  const { data: townsData } = useGetTownsByProvinceIdQuery(provinceId, {
    skip: !provinceId,
  });
  const towns = useMemo(() => townsData?.data ?? [], [townsData]);

  // Resolve user's town name to ID on load
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

  const clearError = useCallback((field: keyof PersonalDetailsValues) => {
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

      // Resolve IDs back to names
      const provinceName = provinceId
        ? (provinces.find((p) => (p.id ?? p.name) === provinceId)?.name ?? undefined)
        : undefined;
      const townName = townId
        ? (towns.find((t) => (t.id ?? t.name) === townId)?.name ?? undefined)
        : undefined;

      const values: PersonalDetailsValues = {
        gender: gender || undefined,
        DOB: dob || undefined,
        province: provinceName,
        town: townName,
      };

      const result = personalDetailsSchema.safeParse(values);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof PersonalDetailsValues, string>> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof PersonalDetailsValues;
          if (field) fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }

      try {
        await updateProfile({
          firstName: reduxUser?.firstName ?? "",
          lastName: reduxUser?.lastName ?? "",
          gender: result.data.gender,
          DOB: result.data.DOB,
          province: result.data.province,
          town: result.data.town,
          profilePictureUrl: reduxUser?.profilePictureUrl || undefined,
        }).unwrap();
        toast.success("Profile updated");
        onSuccess();
      } catch {
        // Error toast is handled in the slice
      }
    },
    [gender, dob, provinceId, townId, provinces, towns, updateProfile, onSuccess, reduxUser],
  );

  return {
    gender,
    setGender,
    dob,
    setDob,
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
