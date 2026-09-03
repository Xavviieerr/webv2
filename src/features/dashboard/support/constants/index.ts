import { IconBug, IconMessage, IconAlertCircle, IconHelpCircle } from "@tabler/icons-react";
import type { TicketCategory } from "../types";

export const TICKET_CATEGORIES: Record<TicketCategory, { i18nKey: string; icon: typeof IconBug }> = {
  bug: { i18nKey: "bugReport", icon: IconBug },
  feedback: { i18nKey: "feedback", icon: IconMessage },
  complaint: { i18nKey: "complaint", icon: IconAlertCircle },
  other: { i18nKey: "other", icon: IconHelpCircle },
};

export const SUBJECT_MAX_LENGTH = 150;
export const MESSAGE_MAX_LENGTH = 2000;

export const CONTACT_EMAIL = "support@guono.com";

export const SUPPORT_COLORS = {
  pageBg: "#D4E8EA",
  contentBg: "#F2FEFF",
  cardBg: "#8AA5A81A",
  primaryText: "#0D4D4D",
  secondaryText: "#6A6A6A",
  activeText: "#FFFFFF",
  accentRed: "#C14A4A",
  accentTeal: "#0E808D",
} as const;
