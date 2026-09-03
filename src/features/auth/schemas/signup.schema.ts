import { z } from "zod";

export const signupStep1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender",
  }),
  DOB: z.string().min(1, "Date of birth is required"),
  province: z.string().optional(),
  town: z.string().optional(),
});

export const signupStep2Schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupFullSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender",
  }),
  DOB: z.string().min(1, "Date of birth is required"),
  province: z.string().optional(),
  town: z.string().optional(),
});

export function validateSignupStep(step: number, data: Record<string, unknown>): string | null {
  const schema = step === 1 ? signupStep1Schema : signupStep2Schema;
  const result = schema.safeParse(data);
  return result.success ? null : result.error.issues[0].message;
}
