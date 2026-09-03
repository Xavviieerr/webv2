"use client";

import { useTranslation } from "react-i18next";
import { IconPlus, IconRefresh, IconChevronRight, IconHelpCircle } from "@tabler/icons-react";
import { TICKET_CATEGORIES } from "../constants";
import type { SupportTicket } from "../types";

interface TicketListProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  error: unknown;
  pagination: { page: number; totalPages: number; total: number } | null;
  onTicketClick: (ticket: SupportTicket) => void;
  onCreateNew: () => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  showHeader?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
};

export function TicketList({
  tickets: rawTickets,
  isLoading,
  error,
  pagination,
  onTicketClick,
  onCreateNew,
  onRefresh,
  onPageChange,
  showHeader = true,
}: TicketListProps) {
  const { t } = useTranslation("common");
  const tickets = Array.isArray(rawTickets) ? rawTickets : [];
  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div>
            <h1 className="text-lg font-semibold text-[#0D4D4D]">
              {t("helpAndSupport")}
            </h1>
            <p className="text-xs text-[#0D4D4D]/50">
              {pagination
                ? `${pagination.total} ${t("myTickets").toLowerCase()}`
                : t("manageYourSupportTickets")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1.5 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50"
            >
              <IconRefresh className="size-3.5" />
            </button>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0E808D]/90"
            >
              <IconPlus className="size-3.5" />
              {t("newTicket")}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2 px-5 sm:px-6 pb-5 sm:pb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-transparent bg-[#8AA5A81A] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm text-red-500">{t("failedToLoadTickets")}</p>
          <button
            onClick={onRefresh}
            className="rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm font-medium text-[#0D4D4D]">{t("noTicketsYet")}</p>
          <p className="text-xs text-[#0D4D4D]/50">
            {t("createTicketPrompt")}
          </p>
          <button
            onClick={onCreateNew}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#0E808D] px-4 py-2 text-sm font-medium text-white"
          >
            <IconPlus className="size-3.5" />
            {t("createTicket")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-5 sm:px-6 pb-5 sm:pb-6">
          {tickets.map((ticket) => {
            const categoryInfo = TICKET_CATEGORIES[ticket.category];
            return (
              <button
                key={ticket.id}
                onClick={() => onTicketClick(ticket)}
                className="flex items-center gap-4 rounded-xl border border-transparent bg-[#D4E8EA]/70 px-4 sm:px-5 py-4 text-left transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-center shrink-0">
                  {categoryInfo ? (
                    <categoryInfo.icon className="w-5 h-5 text-[#0E808D]" />
                  ) : (
                    <IconHelpCircle className="w-5 h-5 text-[#0E808D]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#0D4D4D] truncate">
                      {ticket.subject}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${STATUS_STYLES[ticket.status] ?? STATUS_STYLES.open}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">
                    {ticket.message}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#0D4D4D]/40">
                    {categoryInfo && (
                      <span>{t(categoryInfo.i18nKey)}</span>
                    )}
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <IconChevronRight className="w-4 h-4 text-[#0E808D] shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 sm:px-6 pb-5 sm:pb-6">
          <p className="text-xs text-[#0D4D4D]/50">
            {t("pageXofY", { page: pagination.page, total: pagination.totalPages })}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("previous")}
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-1 text-xs font-medium text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
