import {
  Lock,
  Mail,
  Monitor,
  AlertTriangle,
} from "lucide-react";

export const SECURITY_CARDS = [
  {
    icon: Lock,
    titleKey: "changePassword",
    descriptionKey: "changePasswordDescription",
    buttonKey: "changePassword",
    variant: "default" as const,
  },
  {
    icon: Mail,
    titleKey: "changeEmail",
    descriptionKey: "changeEmailDescription",
    buttonKey: "changeEmail",
    variant: "default" as const,
  },
  {
    icon: Monitor,
    titleKey: "activeSessions",
    descriptionKey: "manageYourActiveSessions",
    buttonKey: "manage",
    variant: "default" as const,
  },
  {
    icon: AlertTriangle,
    titleKey: "deleteAccount",
    descriptionKey: "permanentlyDeleteYourData",
    buttonKey: "deleteAccount",
    variant: "destructive" as const,
  },
] as const;

export const SETTINGS_COLORS = {
  pageBg: "#D4E8EA",
  contentBg: "#F2FEFF",
  cardBg: "#8AA5A81A",
  primaryText: "#0D4D4D",
  secondaryText: "#6A6A6A",
  activeText: "#FFFFFF",
  accentRed: "#C14A4A",
  accentTeal: "#0E808D",
} as const;
