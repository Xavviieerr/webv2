"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { SECURITY_CARDS, SETTINGS_COLORS as COLORS } from "../constants";
import { parseUserAgent } from "../utils";
import ForgotPasswordFlow from "./ForgotPasswordFlow";
import DeleteAccountView from "./DeleteAccountView";
import ChangeEmailView from "./ChangeEmailView";
import {
  useGetSessionsQuery,
  useLogoutSessionMutation,
  useLogoutAllSessionsMutation,
} from "@/features/auth/api/userEndpoints";
import { logoutHandler } from "@/features/auth/lib/logoutHandler";
import type { User as AppUser } from "@/types";
import type { SecurityView } from "../types";

interface SecuritySectionProps {
  view: SecurityView;
  onViewChange: (view: SecurityView) => void;
  user: AppUser | null | undefined;
}

const VIEW_MAP: Record<Exclude<SecurityView, "list">, string> = {
  password: "password",
  email: "email",
  sessions: "sessions",
  delete: "delete",
};

export function SecuritySection({
  view,
  onViewChange,
  user,
}: SecuritySectionProps) {
  const { t } = useTranslation("common");
  const router = useRouter();

  if (view === "password") {
    return (
      <div className="p-4 sm:p-6 flex flex-col gap-4 flex-1 w-full">
        <ForgotPasswordFlow onClose={() => onViewChange("list")} />
      </div>
    );
  }

  if (view === "sessions") {
    return (
      <SessionsView
        onBack={() => onViewChange("list")}
        onLogoutAll={() => {
          logoutHandler();
          router.push("/signin");
        }}
      />
    );
  }

  if (view === "delete") {
    return <DeleteAccountView user={user} onCancel={() => onViewChange("list")} />;
  }

  if (view === "email") {
    return (
      <ChangeEmailView
        currentEmail={user?.email ?? ""}
        onBack={() => onViewChange("list")}
        onLogout={() => {
          logoutHandler();
          router.push("/signin");
        }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-3 flex-1 max-w-2xl mx-auto w-full">
      {SECURITY_CARDS.map((card, index) => {
        const Icon = card.icon;
        const cardKeys = ["password", "email", "sessions", "delete"] as const;
        const viewTarget = VIEW_MAP[cardKeys[index] as keyof typeof VIEW_MAP];
        const isDestructive = card.variant === "destructive";

        return (
          <div
            key={card.titleKey}
            className={`flex items-center gap-4 rounded-xl px-4 sm:px-5 py-4 transition-all ${
              isDestructive
                ? "border border-red-100 bg-red-50/60 hover:shadow-lg"
                : "border border-transparent bg-[#D4E8EA] hover:shadow-lg"
            }`}
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
                isDestructive ? "bg-red-100" : "bg-[#0D4D4D]"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isDestructive ? "text-[#C14A4A]" : "text-white"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${
                  isDestructive ? "text-[#C14A4A]" : "text-[#0D4D4D]"
                }`}
              >
                {t(card.titleKey)}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isDestructive ? "text-[#C14A4A]/70" : "text-gray-600"
                }`}
              >
                {t(card.descriptionKey)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onViewChange(viewTarget as SecurityView)}
              className={`inline-flex items-center gap-1 text-xs font-medium shrink-0 px-3 py-1.5 rounded-lg transition-colors ${
                isDestructive
                  ? "text-[#C14A4A] hover:text-[#C14A4A]/80 hover:bg-red-50"
                  : "text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5"
              }`}
            >
              {t(card.buttonKey)}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SessionsView({
  onBack,
  onLogoutAll,
}: {
  onBack: () => void;
  onLogoutAll: () => void;
}) {
  const { t } = useTranslation("common");
  const { data: sessions = [], isLoading, error, refetch } = useGetSessionsQuery();
  const [logoutSession, { isLoading: isLoggingOut }] = useLogoutSessionMutation();
  const [logoutAllSessions, { isLoading: isLoggingOutAll }] = useLogoutAllSessionsMutation();

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await logoutSession(sessionId).unwrap();
      refetch();
    } catch {
      // error handled by RTK Query
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions().unwrap();
      onLogoutAll();
    } catch {
      // error handled by RTK Query
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 flex-1 w-full">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold" style={{ color: COLORS.primaryText }}>
          {t("activeSessions")}
        </h2>
        <p className="text-sm" style={{ color: COLORS.secondaryText }}>
          {t("manageYourActiveSessions")}
        </p>
      </div>

      <div className="rounded-xl border border-transparent bg-[#D4E8EA] divide-y divide-[#0D4D4D]/10">
        {isLoading ? (
          <div className="px-4 py-6 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: COLORS.secondaryText }} />
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm mb-2" style={{ color: COLORS.secondaryText }}>
              Failed to load sessions
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-medium hover:underline"
              style={{ color: COLORS.accentTeal }}
            >
              {t("tryAgain")}
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm" style={{ color: COLORS.secondaryText }}>
            No active sessions
          </div>
        ) : (
          sessions.map((session, index) => {
            const deviceLabel = parseUserAgent(session.userAgent);
            const isCurrent = index === 0;
            return (
              <div key={session.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0D4D4D]">{deviceLabel}</p>
                  <p className="text-xs text-[#0D4D4D]/50">
                    {session.ipAddress || "—"} · {new Date(session.lastActivity).toLocaleString()}
                  </p>
                </div>
                {isCurrent ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Current
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={() => handleLogoutSession(session.id)}
                    className="text-sm font-medium text-[#C14A4A] hover:text-[#A93A3A] disabled:opacity-50"
                  >
                    Log out
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          className="w-full sm:w-1/2 py-2.5 rounded-lg border border-[#0D4D4D]/15 text-sm font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/30 transition-colors"
          onClick={onBack}
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          disabled={isLoggingOutAll}
          onClick={handleLogoutAll}
          className="w-full sm:w-1/2 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-95 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: COLORS.accentTeal }}
        >
          {isLoggingOutAll && <Loader2 className="w-4 h-4 animate-spin" />}
          Log out everywhere
        </button>
      </div>
    </div>
  );
}

export default SecuritySection;
