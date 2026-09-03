"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContactInfo } from "./ContactInfo";
import { TicketForm } from "./TicketForm";
import { TicketList } from "./TicketList";
import { TicketDetail } from "./TicketDetail";
import { useTicketList } from "../hooks/useTicketList";
import type { SupportTicket } from "../types";

type View = "list" | "create" | "detail";

export function HelpSupportPage() {
  const { t } = useTranslation("common");
  const [view, setView] = useState<View>("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const ticketList = useTicketList();

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedTicket(null);
    setView("list");
  };

  const handleCreateSuccess = () => {
    ticketList.refetch();
    setView("list");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-lg mt-4 sm:mt-6">
      <ContactInfo className="flex-1 min-w-0" />

      <div className="w-full lg:w-[420px] shrink-0">
        <div className="bg-[#F2FEFF] rounded-xl border border-[#0D4D4D]/10 overflow-hidden max-h-[600px] flex flex-col">
          {view === "list" && (
            <>
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
                    {t("myTickets")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setView("create")}
                    className="text-xs text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors"
                  >
                    {t("newTicket")}
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                <TicketList
                  tickets={ticketList.tickets}
                  isLoading={ticketList.isLoading}
                  error={ticketList.error}
                  pagination={ticketList.pagination}
                  onTicketClick={handleTicketClick}
                  onCreateNew={() => setView("create")}
                  onRefresh={ticketList.refetch}
                  onPageChange={ticketList.setPage}
                  showHeader={false}
                />
              </div>
            </>
          )}

          {view === "create" && (
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <TicketForm
                onBack={() => setView("list")}
                onSuccess={handleCreateSuccess}
              />
            </div>
          )}

          {view === "detail" && selectedTicket && (
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <TicketDetail ticket={selectedTicket} onBack={handleBack} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
