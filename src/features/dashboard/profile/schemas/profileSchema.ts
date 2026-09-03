import { z } from "zod";

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "firstNameRequired")
    .max(50, "firstNameTooLong"),
  lastName: z
    .string()
    .min(1, "lastNameRequired")
    .max(50, "lastNameTooLong"),
});

export const usernameUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "usernameMinLength")
    .max(30, "usernameTooLong")
    .regex(/^[a-zA-Z0-9_]+$/, "usernameInvalidChars"),
});

export const personalDetailsSchema = z.object({
  gender: z.string().optional(),
  DOB: z.string().optional(),
  province: z.string().max(100, "provinceTooLong").optional(),
  town: z.string().max(100, "townTooLong").optional(),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
export type UsernameUpdateValues = z.infer<typeof usernameUpdateSchema>;
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
