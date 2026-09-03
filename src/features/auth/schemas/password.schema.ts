import { z } from "zod";

export const emailSchema = z.string().email("pleaseEnterValidEmail");

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "passwordMustBeAtLeast8Characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwordsDoNotMatch",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "currentPasswordRequired"),
  newPassword: z.string().min(8, "passwordMustBeAtLeast8Characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: "newPasswordMustBeDifferent",
  path: ["newPassword"],
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "passwordsDoNotMatch",
  path: ["confirmNewPassword"],
});

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "enterEmailAddress";
  const result = emailSchema.safeParse(email);
  return result.success ? null : "pleaseEnterValidEmail";
}

export function validateResetPassword(password: string, confirmPassword: string): string | null {
  if (password.length < 8) return "passwordMustBeAtLeast8Characters";
  if (password !== confirmPassword) return "passwordsDoNotMatch";
  return null;
}
