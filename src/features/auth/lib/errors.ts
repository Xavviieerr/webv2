export function extractErrorMessage(err: unknown, fallback = ""): string {
  const errorData = (err as { data?: unknown })?.data;
  if (typeof errorData === "string") return errorData;
  if (errorData && typeof errorData === "object") {
    return (
      (errorData as { message?: string }).message ||
      (errorData as { error?: string }).error ||
      fallback
    );
  }
  return fallback;
}
