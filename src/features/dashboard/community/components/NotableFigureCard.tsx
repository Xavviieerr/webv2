"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/types/hooks";
import { IconUser } from "@tabler/icons-react";

interface NotableFigure {
  id: string;
  fullName: string;
  occupation: string;
  shortBio: string;
  profilePhoto: string | null;
}

const PAGE_SIZE = 3;

export function NotableFigureCard() {
  const { t } = useTranslation("common");
  const token = useAppSelector((state) => state.auth.token);
  const [figure, setFigure] = useState<NotableFigure | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchRandomFigure = async () => {
      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const countRes = await fetch(`${baseUrl}/figures/count/total`, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        const countData = await countRes.json();
        const total: number = countData?.data ?? 0;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const randomPage = Math.floor(Math.random() * totalPages) + 1;

        const url = `${baseUrl}/figures?page=${randomPage}&limit=${PAGE_SIZE}&sortBy=fullName&sortDir=ASC&status=approved`;
        const response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const { data } = await response.json();
        const items = Array.isArray(data) ? data : (data?.items ?? []);

        if (items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setFigure(items[randomIndex]);
        }
      } catch {
        setFigure(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomFigure();

    return () => controller.abort();
  }, [token]);

  return (
    <div className="rounded-2xl border border-[#02474F]/10 bg-[#D4E8EA]/70 p-5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#02474F]/50">
        {t("notableFigure", "Notable Figure")}
      </span>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
            <div className="h-3 w-1/2 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          </div>
        </div>
      ) : figure ? (
        <div className="mt-3 flex items-start gap-3">
          {figure.profilePhoto ? (
            <img
              src={figure.profilePhoto}
              alt={figure.fullName}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#02474F]/10"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#02474F]/10 flex items-center justify-center shrink-0">
              <IconUser className="w-5 h-5 text-[#02474F]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#02474F] truncate">
              {figure.fullName}
            </p>
            <p className="text-[11px] text-[#02474F]/50 truncate">
              {figure.occupation}
            </p>
            <Link
              href={`/dashboard/figures/${figure.id}`}
              className="inline-block mt-1.5 text-[11px] font-medium text-[#0E808D] hover:text-[#0E808D]/80 transition-colors"
            >
              {t("viewProfile", "View Profile")} &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#02474F]/50 mt-3">
          {t("noNotableFigures", "No notable figures available.")}
        </p>
      )}
    </div>
  );
}
