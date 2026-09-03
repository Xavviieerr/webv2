/** Trim + lowercase an email address */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize a login identifier:
 * - If it looks like an email → lowercase + trim
 * - Otherwise → trim only (preserve case for usernames)
 */
export function normalizeIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }
  return trimmed;
}
