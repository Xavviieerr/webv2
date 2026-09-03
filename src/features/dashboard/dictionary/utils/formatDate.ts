import {
  DATE_FALLBACK_SHORT,
  DATE_FALLBACK_DATETIME,
} from "../constants/format";

export function formatDate(
  dateString?: string,
  format: "short" | "datetime" = "short",
): string {
  if (!dateString) {
    if (format === "datetime") return DATE_FALLBACK_DATETIME;
    return DATE_FALLBACK_SHORT;
  }
  try {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    if (format === "datetime") {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${month} ${day} ${hours}:${minutes}`;
    }

    return `${month} ${day}, ${year}`;
  } catch {
    if (format === "datetime") return DATE_FALLBACK_DATETIME;
    return DATE_FALLBACK_SHORT;
  }
}

/** Renders a relative "Today / N Days Ago / N Weeks Ago…" label for a date. */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Recently";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 Day Ago";
    if (diffDays < 7) return `${diffDays} Days Ago`;

    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return `${weeks} ${weeks === 1 ? "Week" : "Weeks"} Ago`;

    const months = Math.floor(diffDays / 30);
    if (diffDays < 365) {
      return `${months} ${months === 1 ? "Month" : "Months"} Ago`;
    }

    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "Year" : "Years"} Ago`;
  } catch {
    return "Recently";
  }
}
