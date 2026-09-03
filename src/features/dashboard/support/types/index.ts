export type TicketCategory = "bug" | "feedback" | "complaint" | "other";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  category: TicketCategory;
  subject: string;
  message: string;
}

export interface TicketListResponse {
  data: SupportTicket[] | { items?: SupportTicket[]; total?: number; page?: number; limit?: number; totalPages?: number };
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface TicketDetailResponse {
  data: SupportTicket;
}

export interface TicketListQueryParams {
  page?: number;
  limit?: number;
  status?: TicketStatus | "";
}
