import {
  STATUS_LABEL_MAP,
  STATUS_FALLBACK_LABEL,
} from "../constants/status";
import type { WordWithPronunciation } from "../types/word";

export type { WordWithPronunciation };

export function getStatusDisplay(status: string): string {
  return STATUS_LABEL_MAP[status.toLowerCase()] || STATUS_FALLBACK_LABEL;
}

export function getPronunciation(
  word: WordWithPronunciation | null | undefined,
): string {
  if (word?.oho && word.oho.length > 0) {
    const firstOho = word.oho[0];
    return firstOho.uphoesio || firstOho.upho || "";
  }
  return "";
}
