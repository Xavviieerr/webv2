"use client";

import { useRef, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/types/hooks";
import {
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/slice/userEndpoints";

const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function useAvatarUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > AVATAR_MAX_SIZE_BYTES) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUpdating(true);
      try {
        const uploadResult = await updateProfileImage({ imageFile: file }).unwrap();
        const profilePictureUrl = uploadResult.medium;
        await updateProfile({
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          gender: user?.gender || undefined,
          DOB: user?.DOB || undefined,
          province: user?.province || undefined,
          town: user?.town || undefined,
          profilePictureUrl,
        }).unwrap();
        toast.success("Profile picture updated");
      } catch {
        // Error toast is handled in the slice
      } finally {
        setIsUpdating(false);
      }
      e.target.value = "";
    },
    [updateProfileImage, updateProfile, user?.firstName, user?.lastName],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    isUpdating,
    handleFileChange,
    triggerFileInput,
  };
}
