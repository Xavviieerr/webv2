"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/types/hooks";
import { IconList, IconLoaderQuarter } from "@tabler/icons-react";
import { NameCard } from "./components/name-card";
import { NameFilters } from "./components/name-filters";
import { NameSearchBar } from "./components/name-search-bar";
import { NameDetailView } from "./components/name-detail-view";
import { NamesPagination } from "./components/NamesPagination";
import { EmptyState } from "./components/empty-state";
import { fetchNames } from "./lib/api/fetch-names";
import { useNameCountTotalQuery } from "@/features/search/lib/api/searchApi";
import type { NameItem } from "./types";

const NamesPediaContent = ({
  query,
}: {
  query: { type: string; gender: string; search: string; page: string };
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedName, setSelectedName] = useState<NameItem | null>(null);
  const [names, setNames] = useState<NameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const { data: nameCountResponse, isLoading: isCountLoading } =
    useNameCountTotalQuery();
  const nameCount = nameCountResponse?.data ?? 0;

  const loadNames = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await fetchNames({
        token,
        page: query.page,
        search: query.search,
        type: query.type !== "all" ? query.type : undefined,
        gender: query.gender !== "all" ? (query.gender as "neutral" | "male" | "female") : undefined,
        status: "approved",
      });
      setNames(result.data.filter((n) => n.status === "approved"));
      setPagination(result.pagination);
    } catch {
      setNames([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, query.page, query.search, query.type, query.gender]);

  useEffect(() => {
    loadNames();
  }, [loadNames]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  if (selectedName) {
    return (
      <div className="flex flex-col items-center w-full h-full py-10 lg:px-20 md:px-10 px-4 font-plus-sans">
        <div className="max-w-4xl w-full">
          <NameDetailView
            name={selectedName}
            onBack={() => setSelectedName(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center absolute left-0 top-0 w-full h-full py-10 lg:px-20 md:px-10 px-4 font-plus-sans">
      <div className="flex flex-col items-center max-w-2xl w-full mt-8">
        <div className="h-18 w-18 bg-primary text-base-yellow flex justify-center items-center rounded-full mb-5">
          <IconList size={36} />
        </div>
        <h1 className="text-4xl max-md:text-2xl font-medium text-primary">
          Urhobo Names
        </h1>
        <p className="text-lg max-md:text-base pt-3 pb-2 max-lg:text-center mb-2">
          Find Urhobo names, meanings, explanations and more.
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Name Count: {isCountLoading ? "…" : nameCount.toLocaleString()}
        </p>

        <NameSearchBar onSelectName={setSelectedName} />
      </div>

      <NameFilters type={query.type} gender={query.gender} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoaderQuarter
            size={48}
            className="animate-spin text-foreground-50"
          />
        </div>
      ) : names.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5">
            {names.map((item) => (
              <NameCard
                key={item.id}
                id={item.id}
                name={item.name}
                translations={item.translations}
                gender={item.gender}
                nameType={item.nameType}
                onSelect={() => setSelectedName(item)}
              />
            ))}
          </div>
          <NamesPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default NamesPediaContent;
