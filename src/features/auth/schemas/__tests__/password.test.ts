import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateResetPassword,
  changePasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/password.schema";

describe("validateEmail", () => {
  it("rejects empty string", () => {
    expect(validateEmail("")).toBe("enterEmailAddress");
  });

  it("rejects invalid email format", () => {
    expect(validateEmail("notanemail")).toBe("pleaseEnterValidEmail");
  });

  it("accepts valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });
});

describe("validateResetPassword", () => {
  it("rejects password shorter than 8 chars", () => {
    expect(validateResetPassword("short", "short")).toBe(
      "passwordMustBeAtLeast8Characters",
    );
  });

  it("rejects mismatched passwords", () => {
    expect(validateResetPassword("password1", "password2")).toBe(
      "passwordsDoNotMatch",
    );
  });

  it("accepts matching passwords >= 8 chars", () => {
    expect(validateResetPassword("password1", "password1")).toBeNull();
  });
});

describe("resetPasswordSchema", () => {
  it("rejects mismatched passwords via refine", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password1",
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("passwordsDoNotMatch");
    }
  });

  it("accepts matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(true);
  });
});

describe("changePasswordSchema", () => {
  it("rejects same new password as current", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "password1",
      newPassword: "password1",
      confirmNewPassword: "password1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("newPasswordMustBeDifferent");
    }
  });

  it("rejects mismatched confirm password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword",
      newPassword: "newpassword1",
      confirmNewPassword: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("passwordsDoNotMatch");
    }
  });

  it("accepts valid change password input", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword",
      newPassword: "newpassword1",
      confirmNewPassword: "newpassword1",
    });
    expect(result.success).toBe(true);
  });
});
