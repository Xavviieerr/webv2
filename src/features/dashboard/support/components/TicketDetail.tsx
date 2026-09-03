"use client";

import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import { TICKET_CATEGORIES } from "../constants";
import type { SupportTicket } from "../types";

interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
};

export function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const { t } = useTranslation("common");
  const categoryInfo = TICKET_CATEGORIES[ticket.category];

  return (
    <div className="flex flex-col">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-2 text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50"
          >
            <IconArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
              {t("ticketDetails")}
            </h1>
            <p className="text-[11px] text-[#0D4D4D]/40">
              {ticket.id}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="rounded-xl border border-transparent bg-[#D4E8EA]/70 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-sm font-semibold text-[#0D4D4D]">
              {ticket.subject}
            </h2>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[ticket.status] ?? STATUS_STYLES.open}`}
            >
              {ticket.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-[11px] text-[#0D4D4D]/40">
            {categoryInfo && (
              <span className="inline-flex items-center gap-1">
                <categoryInfo.icon className="size-3" />
                {t(categoryInfo.i18nKey)}
              </span>
            )}
            <span>
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-4 border-t border-[#0D4D4D]/10 pt-4">
            <p className="text-sm text-[#0D4D4D] leading-relaxed whitespace-pre-wrap">
              {ticket.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
