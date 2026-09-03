import { useState, useCallback } from "react";
import { useGetMyTicketsQuery } from "../api/supportEndpoints";
import type { TicketListQueryParams } from "../types";

export function useTicketList(initialParams: TicketListQueryParams = {}) {
  const [params, setParams] = useState<TicketListQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const { data, isLoading, isFetching, error, refetch } = useGetMyTicketsQuery(params);

  const setPage = useCallback(
    (page: number) => setParams((p) => ({ ...p, page })),
    [],
  );

  const setStatus = useCallback(
    (status: TicketListQueryParams["status"]) =>
      setParams((p) => ({ ...p, status, page: 1 })),
    [],
  );

  const rawTickets = data?.tickets;
  const tickets = Array.isArray(rawTickets) ? rawTickets : [];

  return {
    tickets,
    pagination: data
      ? { page: data.page, totalPages: data.totalPages, total: data.total }
      : null,
    params,
    isLoading,
    isFetching,
    error,
    refetch,
    setPage,
    setStatus,
  };
}
