import type { User as AppUser } from "@/types";

export type SecurityView = "list" | "password" | "sessions" | "delete" | "email";

export interface SecuritySectionProps {
  view: SecurityView;
  onViewChange: (view: SecurityView) => void;
  user: AppUser | null | undefined;
}

export interface ChangePasswordFormProps {
  onCancel: () => void;
}

export interface DeleteAccountViewProps {
  user: AppUser | null | undefined;
  onCancel: () => void;
}

export interface SecuritySessionListProps {
  user: AppUser | null | undefined;
  onBack: () => void;
}
