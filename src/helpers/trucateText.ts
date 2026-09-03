export const truncateText = (text: string, maxLength: number, suffix = "…") => {
  if (typeof text !== "string") return "";
  if (typeof maxLength !== "number" || maxLength <= 0) return text;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + suffix;
};
