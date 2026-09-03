import { STORAGE_KEYS, GUONO_LOGGED_IN_COOKIE } from "@/features/auth/constants";
import type { AuthUser } from "@/features/auth/types";

const isBrowser = () => typeof window !== "undefined";

function getStorage(stayLoggedIn: boolean): Storage {
  return stayLoggedIn ? localStorage : sessionStorage;
}

function getStayLoggedInPreference(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.STAY_LOGGED_IN) === "true";
  } catch {
    return false;
  }
}

// In-memory fallback for when storage is unavailable (Safari Private Mode, quota exceeded)
const memoryFallback = new Map<string, string>();

function safeGetItem(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

function safeSetItem(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    memoryFallback.set(key, value);
  }
}

function safeRemoveItem(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    memoryFallback.delete(key);
  }
}

function safeRemoveBoth(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    memoryFallback.delete(key);
  }
  try {
    sessionStorage.removeItem(key);
  } catch {
    memoryFallback.delete(key);
  }
}

function setCookie(name: string, value: string, maxAge?: number): void {
  if (!isBrowser()) return;
  try {
    document.cookie = maxAge !== undefined
      ? `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
      : `${name}=${value}; path=/; SameSite=Lax`;
  } catch {
    // Cookie write failed — best effort
  }
}

function clearCookie(name: string): void {
  if (!isBrowser()) return;
  try {
    document.cookie = `${name}=; path=/; max-age=0`;
  } catch {
    // Cookie clear failed — best effort
  }
}

function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null;
  const stayLoggedIn = getStayLoggedInPreference();
  const storage = getStorage(stayLoggedIn);
  const raw = safeGetItem(storage, key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!isBrowser()) return;
  const stayLoggedIn = getStayLoggedInPreference();
  const storage = getStorage(stayLoggedIn);
  safeSetItem(storage, key, JSON.stringify(value));
}

export interface SessionTokens {
  accessToken: string | null;
  refreshToken: string | null;
  stayLoggedIn: boolean;
}

export interface SessionData extends SessionTokens {
  user: AuthUser | null;
}

export const session = {
  // ── Tokens ───────────────────────────────────────────────

  saveTokens(accessToken: string, refreshToken: string, stayLoggedIn: boolean): void {
    if (!isBrowser()) return;
    const storage = getStorage(stayLoggedIn);
    safeSetItem(storage, STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    safeSetItem(storage, STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    safeSetItem(localStorage, STORAGE_KEYS.STAY_LOGGED_IN, stayLoggedIn ? "true" : "false");
    setCookie(GUONO_LOGGED_IN_COOKIE, "1", stayLoggedIn ? 31536000 : undefined);
    setCookie(STORAGE_KEYS.ACCESS_TOKEN, accessToken, stayLoggedIn ? 31536000 : undefined);
  },

  loadTokens(): SessionTokens {
    if (!isBrowser()) return { accessToken: null, refreshToken: null, stayLoggedIn: false };
    const stayLoggedIn = getStayLoggedInPreference();
    const storage = getStorage(stayLoggedIn);
    return {
      accessToken: safeGetItem(storage, STORAGE_KEYS.ACCESS_TOKEN),
      refreshToken: safeGetItem(storage, STORAGE_KEYS.REFRESH_TOKEN),
      stayLoggedIn,
    };
  },

  // ── User ─────────────────────────────────────────────────

  saveUser(user: AuthUser): void {
    writeJson(STORAGE_KEYS.USER, user);
  },

  loadUser(): AuthUser | null {
    return readJson<AuthUser>(STORAGE_KEYS.USER);
  },

  // ── Full session ─────────────────────────────────────────

  saveSession(params: {
    accessToken: string;
    refreshToken: string;
    stayLoggedIn: boolean;
    user: AuthUser;
  }): void {
    this.saveTokens(params.accessToken, params.refreshToken, params.stayLoggedIn);
    this.saveUser(params.user);
  },

  loadSession(): SessionData {
    const tokens = this.loadTokens();
    const user = this.loadUser();
    return { ...tokens, user };
  },

  clearSession(): void {
    if (!isBrowser()) return;
    const keys = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.STAY_LOGGED_IN,
    ];
    keys.forEach(safeRemoveBoth);
    clearCookie(STORAGE_KEYS.ACCESS_TOKEN);
    clearCookie(GUONO_LOGGED_IN_COOKIE);
  },

  // ── Signup context (transient) ───────────────────────────

  saveSignupContext(params: { email: string }): void {
    if (!isBrowser()) return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.EMAIL, JSON.stringify(params.email));
    } catch {
      memoryFallback.set(STORAGE_KEYS.EMAIL, JSON.stringify(params.email));
    }
  },

  loadSignupContext(): { email: string | null } {
    if (!isBrowser()) return { email: null };
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(STORAGE_KEYS.EMAIL);
    } catch {
      raw = memoryFallback.get(STORAGE_KEYS.EMAIL) ?? null;
    }
    if (!raw) return { email: null };
    try {
      return { email: JSON.parse(raw) as string };
    } catch {
      return { email: raw };
    }
  },

  clearSignupContext(): void {
    if (!isBrowser()) return;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.EMAIL);
    } catch {
      memoryFallback.delete(STORAGE_KEYS.EMAIL);
    }
  },
};
