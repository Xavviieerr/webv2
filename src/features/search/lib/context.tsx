"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SearchStateProvider, useSearchState } from "./search-state-context";
import {
  SearchHistoryProvider,
  useSearchHistoryCtx,
} from "./search-history-context";
import { safeDecodeURIComponent } from "./helpers/safe-decode";

type QueryCTX = ReturnType<typeof useSearchState> &
  ReturnType<typeof useSearchHistoryCtx>;

function useQueryCtxInner(): QueryCTX {
  const state = useSearchState();
  const history = useSearchHistoryCtx();
  return useMemo(() => ({ ...state, ...history }), [state, history]);
}

const QueryContextProviderInner = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setSearchTerm, setShowSuggestions } = useSearchState();

  const searchParams = useSearchParams();
  const params = useParams();

  React.useEffect(() => {
    const defaultQ =
      searchParams.get("q") ||
      searchParams.get("otaWord") ||
      (params.slug as string) ||
      "";

    setShowSuggestions(false);

    if (defaultQ) setSearchTerm(safeDecodeURIComponent(defaultQ));
  }, [searchParams]);

  return <>{children}</>;
};

const QueryContextProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const params = useParams();

  const initialSearchTerm = useMemo(() => {
    const q =
      searchParams.get("q") ||
      searchParams.get("otaWord") ||
      (params.slug as string) ||
      "";
    return q ? safeDecodeURIComponent(q) : "";
  }, [searchParams, params]);

  return (
    <SearchStateProvider initialSearchTerm={initialSearchTerm}>
      <SearchHistoryProvider>
        <QueryContextProviderInner>{children}</QueryContextProviderInner>
      </SearchHistoryProvider>
    </SearchStateProvider>
  );
};

export const useQueryCtx = () => useQueryCtxInner();

export default QueryContextProvider;
