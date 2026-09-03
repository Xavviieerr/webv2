import { z } from "zod";

export const createOtpSchema = (t: (key: string) => string) =>
  z.object({
    otp: z
      .string()
      .length(6, { message: t("pleaseEnter6digitCode") })
      .regex(/^\d+$/, { message: t("otpMustContainOnlyNumbers") }),
  });

export function validateOtp(fullOtp: string, t: (key: string) => string): string | null {
  const schema = createOtpSchema(t);
  const result = schema.safeParse({ otp: fullOtp });
  return result.success ? null : result.error.issues[0].message;
}
