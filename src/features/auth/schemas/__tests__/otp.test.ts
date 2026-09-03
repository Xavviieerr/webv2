import { describe, it, expect } from "vitest";
import { validateOtp } from "@/features/auth/schemas/otp.schema";

const t = (key: string) => key;

describe("validateOtp", () => {
  it("accepts 6-digit string", () => {
    expect(validateOtp("123456", t)).toBeNull();
  });

  it("rejects string shorter than 6 digits", () => {
    expect(validateOtp("12345", t)).toBe("pleaseEnter6digitCode");
  });

  it("rejects string longer than 6 digits", () => {
    expect(validateOtp("1234567", t)).toBe("pleaseEnter6digitCode");
  });

  it("rejects string containing letters", () => {
    expect(validateOtp("12345a", t)).toBe("otpMustContainOnlyNumbers");
  });

  it("rejects empty string", () => {
    expect(validateOtp("", t)).toBe("pleaseEnter6digitCode");
  });

  it("rejects string with special characters", () => {
    expect(validateOtp("12-456", t)).toBe("otpMustContainOnlyNumbers");
  });
});
