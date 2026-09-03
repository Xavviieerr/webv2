"use client";

import { useTranslation } from "react-i18next";
import { IconArrowLeft, IconSend, IconLoader2 } from "@tabler/icons-react";
import {
  TICKET_CATEGORIES,
  SUBJECT_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
} from "../constants";
import { useCreateTicket } from "../hooks/useCreateTicket";
import type { TicketCategory } from "../types";

interface TicketFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function TicketForm({ onBack, onSuccess }: TicketFormProps) {
  const { t } = useTranslation("common");
  const {
    isSubmitting,
    isSuccess,
    errors,
    handleSubmit,
    category,
    subject,
    message,
    setCategory,
    setSubject,
    setMessage,
  } = useCreateTicket();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({ category, subject, message });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
          <IconSend className="w-8 h-8 text-[#0E808D]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D4D4D]">
          {t("ticketSubmitted")}
        </h3>
        <p className="text-sm text-[#0D4D4D]/60 mt-1 max-w-xs">
          {t("ticketSubmittedMessage")}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          {t("backToTickets")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-[#0D4D4D] transition-colors hover:bg-[#D4E8EA]/50"
        >
          <IconArrowLeft className="size-4" />
        </button>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
          {t("submitATicket")}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label
            htmlFor="ticket-category"
            className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
          >
            {t("category")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.entries(TICKET_CATEGORIES) as [
                TicketCategory,
                {
                  i18nKey: string;
                  icon: React.ComponentType<{ className?: string }>;
                },
              ][]
            ).map(([key, { i18nKey, icon: Icon }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  category === key
                    ? "border-[#0E808D] bg-[#0E808D]/10 text-[#0E808D]"
                    : "border-[#0D4D4D]/15 bg-[#D4E8EA]/30 text-[#0D4D4D] hover:bg-[#D4E8EA]/50"
                }`}
              >
                <Icon className="size-4" />
                {t(i18nKey)}
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>
          )}
        </div>

        <div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
          <label
            htmlFor="ticket-subject"
            className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
          >
            {t("subject")}
          </label>
          <input
            id="ticket-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={SUBJECT_MAX_LENGTH}
            placeholder={t("subjectPlaceholder")}
            className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
          />
          <div className="flex items-center justify-between mt-1.5">
            {errors.subject ? (
              <p className="text-red-500 text-xs">{errors.subject}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-[#0D4D4D]/40">
              {subject.length}/{SUBJECT_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-3">
          <label
            htmlFor="ticket-message"
            className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block"
          >
            {t("message")}
          </label>
          <textarea
            id="ticket-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder={t("messagePlaceholder")}
            className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 focus:outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]"
          />
          <div className="flex items-center justify-between mt-1.5">
            {errors.message ? (
              <p className="text-red-500 text-xs">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-[#0D4D4D]/40">
              {message.length}/{MESSAGE_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div
          className="px-5 sm:px-6 py-4 border-t border-[#0D4D4D]/10 flex items-center justify-end"
          aria-live="polite"
        >
          <button
            type="submit"
            disabled={
              isSubmitting || !category || !subject.trim() || !message.trim()
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin w-4 h-4" />
                <span>{t("submitting")}</span>
              </>
            ) : (
              t("submitTicket")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
