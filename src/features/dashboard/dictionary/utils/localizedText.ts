/**
 * Resolves a localized-text field that may be either a plain string or an
 * object carrying `ota`/`egba` keys (Urhobo / English glosses). Falls back to
 * the raw stringified value when neither is present.
 */
export function resolveLocalizedText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as { ota?: unknown; egba?: unknown };
    if (typeof record.ota === "string" && record.ota) return record.ota;
    if (typeof record.egba === "string" && record.egba) return record.egba;
  }
  return String(value);
}
