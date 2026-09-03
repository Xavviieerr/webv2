import type { User as AppUser } from "@/types";

export type ProfileEditMode = null | "edit";

export interface ProfileSectionProps {
  user: AppUser | null | undefined;
  showLogout?: boolean;
}

export interface ProfileViewProps {
  user: AppUser | null | undefined;
  onEditProfile: () => void;
}

export interface ProfileEditFormProps {
  user: AppUser;
  onCancel: () => void;
}

export interface AvatarUploadProps {
  user: AppUser | null | undefined;
}

export interface AvatarUploadData {
  imageData: string;
  preferredFormat: "webp";
  quality: number;
}

export interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  disabled?: boolean;
  autoComplete?: string;
  error?: string;
  describedBy?: string;
}
