import { z } from "zod";

export const loginIdentifierSchema = z.string().min(1, "enterEmailAddress");

export const loginEmailSchema = z.string().email("pleaseEnterValidEmail");

export const loginUsernameSchema = z.string().min(3, "usernameMinLength");

export const loginPasswordSchema = z.string().min(8, "passwordMinLength");

export function validateLoginIdentifier(identifier: string): string | null {
  if (!identifier.trim()) return "enterEmailAddress";
  const emailCheck = z.string().email().safeParse(identifier);
  if (emailCheck.success) return null;
  const usernameCheck = z.string().min(3).safeParse(identifier);
  if (!usernameCheck.success) return "usernameMinLength";
  return null;
}

export function validateLoginPassword(password: string): string | null {
  const result = loginPasswordSchema.safeParse(password);
  return result.success ? null : "passwordMinLength";
}
