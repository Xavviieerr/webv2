import { describe, it, expect, beforeEach, vi } from "vitest";
import { session } from "@/features/auth/services/session";
import { STORAGE_KEYS } from "@/features/auth/constants";

const mockUser = {
  id: "u1",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  username: "testuser",
  role: "user",
  status: "active",
  isVerified: true,
  isActive: true,
  lastLogin: "2024-01-01",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("session.saveTokens / loadTokens", () => {
  it("persists tokens to localStorage when stayLoggedIn=true", () => {
    session.saveTokens("acc123", "ref456", true);

    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe("acc123");
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe("ref456");
    expect(localStorage.getItem(STORAGE_KEYS.STAY_LOGGED_IN)).toBe("true");
  });

  it("persists tokens to sessionStorage when stayLoggedIn=false", () => {
    session.saveTokens("acc123", "ref456", false);

    expect(sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe("acc123");
    expect(sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe("ref456");
    expect(localStorage.getItem(STORAGE_KEYS.STAY_LOGGED_IN)).toBe("false");
  });

  it("loadTokens returns correct tokens after save", () => {
    session.saveTokens("acc123", "ref456", true);
    const result = session.loadTokens();

    expect(result.accessToken).toBe("acc123");
    expect(result.refreshToken).toBe("ref456");
    expect(result.stayLoggedIn).toBe(true);
  });

  it("loadTokens returns nulls when no tokens saved", () => {
    const result = session.loadTokens();

    expect(result.accessToken).toBeNull();
    expect(result.refreshToken).toBeNull();
    expect(result.stayLoggedIn).toBe(false);
  });

  it("idempotent: saving same tokens twice produces same result", () => {
    session.saveTokens("acc123", "ref456", true);
    session.saveTokens("acc123", "ref456", true);
    const result = session.loadTokens();

    expect(result.accessToken).toBe("acc123");
    expect(result.refreshToken).toBe("ref456");
  });
});

describe("session.saveUser / loadUser", () => {
  it("persists and loads user", () => {
    session.saveUser(mockUser);
    const loaded = session.loadUser();

    expect(loaded).toEqual(mockUser);
  });

  it("returns null when no user saved", () => {
    expect(session.loadUser()).toBeNull();
  });

  it("overwrites previous user on second save", () => {
    session.saveUser(mockUser);
    const updated = { ...mockUser, firstName: "Updated" };
    session.saveUser(updated);

    expect(session.loadUser()?.firstName).toBe("Updated");
  });
});

describe("session.saveSession / loadSession / clearSession", () => {
  it("saveSession persists both tokens and user", () => {
    session.saveSession({
      accessToken: "acc",
      refreshToken: "ref",
      stayLoggedIn: true,
      user: mockUser,
    });

    const result = session.loadSession();
    expect(result.accessToken).toBe("acc");
    expect(result.refreshToken).toBe("ref");
    expect(result.stayLoggedIn).toBe(true);
    expect(result.user).toEqual(mockUser);
  });

  it("clearSession removes all auth data", () => {
    session.saveSession({
      accessToken: "acc",
      refreshToken: "ref",
      stayLoggedIn: true,
      user: mockUser,
    });

    session.clearSession();

    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(session.loadUser()).toBeNull();
  });

  it("clearSession is idempotent", () => {
    session.saveSession({
      accessToken: "acc",
      refreshToken: "ref",
      stayLoggedIn: true,
      user: mockUser,
    });

    session.clearSession();
    session.clearSession();

    expect(session.loadTokens().accessToken).toBeNull();
  });
});

describe("session signup context", () => {
  it("saveSignupContext and loadSignupContext round-trip", () => {
    session.saveSignupContext({ email: "test@example.com" });
    const result = session.loadSignupContext();

    expect(result.email).toBe("test@example.com");
  });

  it("clearSignupContext removes stored email", () => {
    session.saveSignupContext({ email: "test@example.com" });
    session.clearSignupContext();

    expect(session.loadSignupContext().email).toBeNull();
  });

  it("loadSignupContext returns null email when empty", () => {
    expect(session.loadSignupContext().email).toBeNull();
  });
});
