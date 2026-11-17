export { HelpSupportPage } from "./components/HelpSupportPage";
export { ContactInfo } from "./components/ContactInfo";
export { TicketForm } from "./components/TicketForm";
export { TicketList } from "./components/TicketList";
export { TicketDetail } from "./components/TicketDetail";

export { useTicketList } from "./hooks/useTicketList";
export { useCreateTicket } from "./hooks/useCreateTicket";

export { useGetMyTicketsQuery, useGetTicketByIdQuery, useCreateTicketMutation } from "./api/supportEndpoints";

export type { SupportTicket, TicketCategory, TicketStatus, CreateTicketRequest } from "./types";

export { TICKET_CATEGORIES, SUBJECT_MAX_LENGTH, MESSAGE_MAX_LENGTH, CONTACT_EMAIL, SUPPORT_COLORS } from "./constants";

export { createTicketSchema } from "./schemas/supportSchema";
export type { CreateTicketInput } from "./schemas/supportSchema";
