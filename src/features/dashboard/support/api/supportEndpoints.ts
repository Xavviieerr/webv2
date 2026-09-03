import { apiSlice } from "@/slice/requestSlice";
import type { SupportTicket, CreateTicketRequest, TicketListQueryParams } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function extractTickets(raw: any): SupportTicket[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.tickets)) return raw.tickets;
    if (Array.isArray(raw.items)) return raw.items;
    if (raw.data && typeof raw.data === "object") {
      if (Array.isArray(raw.data.data)) return raw.data.data;
      if (Array.isArray(raw.data.tickets)) return raw.data.tickets;
      if (Array.isArray(raw.data.items)) return raw.data.items;
    }
  }
  return [];
}

function extractPagination(raw: any, fallback: number): {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const obj = raw && typeof raw === "object" ? raw : {};
  const inner = obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) ? obj.data : {};
  return {
    total: inner.total ?? obj.total ?? fallback,
    page: inner.page ?? obj.page ?? 1,
    limit: inner.limit ?? obj.limit ?? 20,
    totalPages: inner.totalPages ?? obj.totalPages ?? 1,
  };
}

export const supportEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTickets: builder.query<
      { tickets: SupportTicket[]; total: number; page: number; limit: number; totalPages: number },
      TicketListQueryParams
    >({
      query: (params: TicketListQueryParams = {}) => ({
        url: "/support-tickets/me",
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          ...(params.status && { status: params.status }),
        },
      }),
      transformResponse: (response: unknown) => {
        try {
          const tickets = extractTickets(response);
          const pagination = extractPagination(response, tickets.length);
          return { tickets, ...pagination };
        } catch {
          return { tickets: [], total: 0, page: 1, limit: 20, totalPages: 0 };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.tickets.map((t) => ({
                type: "SupportTicket" as const,
                id: t.id,
              })),
              { type: "SupportTicket" as const, id: "LIST" },
            ]
          : [{ type: "SupportTicket" as const, id: "LIST" }],
    }),

    getTicketById: builder.query<SupportTicket, string>({
      query: (id: string) => `/support-tickets/me/${id}`,
      transformResponse: (response: unknown) => {
        try {
          const raw = response as any;
          return raw?.data ?? raw;
        } catch {
          return response as SupportTicket;
        }
      },
      providesTags: (_result, _err, id) => [{ type: "SupportTicket", id }],
    }),

    createTicket: builder.mutation<SupportTicket, CreateTicketRequest>({
      query: (body: CreateTicketRequest) => ({
        url: "/support-tickets",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        try {
          const raw = response as any;
          return raw?.data ?? raw;
        } catch {
          return response as SupportTicket;
        }
      },
      invalidatesTags: [{ type: "SupportTicket", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
} = supportEndpoints;
