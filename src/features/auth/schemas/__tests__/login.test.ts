import { describe, it, expect } from "vitest";
import {
  validateLoginIdentifier,
  validateLoginPassword,
} from "@/features/auth/schemas/login.schema";

describe("validateLoginIdentifier", () => {
  it("rejects empty string", () => {
    expect(validateLoginIdentifier("")).toBe("enterEmailAddress");
  });

  it("rejects whitespace-only string", () => {
    expect(validateLoginIdentifier("   ")).toBe("enterEmailAddress");
  });

  it("accepts valid email", () => {
    expect(validateLoginIdentifier("test@example.com")).toBeNull();
  });

  it("accepts valid username (>=3 chars)", () => {
    expect(validateLoginIdentifier("abc")).toBeNull();
    expect(validateLoginIdentifier("john_doe")).toBeNull();
  });

  it("rejects username shorter than 3 chars", () => {
    expect(validateLoginIdentifier("ab")).toBe("usernameMinLength");
  });

  it("accepts email-like strings as email", () => {
    expect(validateLoginIdentifier("user@domain.co")).toBeNull();
  });
});

describe("validateLoginPassword", () => {
  it("rejects password shorter than 8 chars", () => {
    expect(validateLoginPassword("short")).toBe("passwordMinLength");
  });

  it("accepts password of exactly 8 chars", () => {
    expect(validateLoginPassword("12345678")).toBeNull();
  });

  it("accepts longer passwords", () => {
    expect(validateLoginPassword("averylongpassword123")).toBeNull();
  });
});
