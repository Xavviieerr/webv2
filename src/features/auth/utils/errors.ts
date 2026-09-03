import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Extracts a human-readable error message from any error shape
 * thrown by RTK Query or plain thrown values.
 */
export function extractErrorMessage(err: unknown, fallback = ""): string {
  if (!err) return fallback;

  // RTK Query FetchBaseQueryError
  const fetchErr = err as Partial<FetchBaseQueryError>;
  if (typeof fetchErr.status === "number" && fetchErr.data !== undefined) {
    const data = fetchErr.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      return (
        (data as { message?: string }).message ||
        (data as { error?: string }).error ||
        fallback
      );
    }
    return fallback;
  }

  // Plain object with data (RTK Query unwrap error shape)
  const unwrapErr = err as { data?: unknown };
  if (unwrapErr.data !== undefined) {
    const data = unwrapErr.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      return (
        (data as { message?: string }).message ||
        (data as { error?: string }).error ||
        fallback
      );
    }
  }

  // Native Error
  if (err instanceof Error) return err.message || fallback;

  // String
  if (typeof err === "string") return err;

  return fallback;
}

/**
 * Extracts a flat list of field-level validation errors (if present).
 * Useful for rendering inline field errors.
 */
export function extractFieldErrors(
  err: unknown,
): Record<string, string> | null {
  const unwrapErr = err as { data?: { errors?: Record<string, string[]> } };
  const errors = unwrapErr?.data?.errors;
  if (!errors || typeof errors !== "object") return null;

  const flat: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      flat[field] = messages[0];
    }
  }
  return Object.keys(flat).length > 0 ? flat : null;
}
