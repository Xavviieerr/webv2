// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/types/hooks";
import { IconLetterA } from "@tabler/icons-react";

interface RandomName {
  id: string;
  name: string;
  meaning: string;
  gender: string;
  nameType: string;
}

export function RandomNameCard() {
  const { t } = useTranslation("common");
  const token = useAppSelector((state) => state.auth.token);
  const [name, setName] = useState<RandomName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchRandomName = async () => {
      setIsLoading(true);
      try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/names?page=${randomPage}&limit=3`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const { data } = await response.json();
        const items = Array.isArray(data) ? data : (data?.items ?? []);

        if (items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setName(items[randomIndex]);
        }
      } catch {
        setName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomName();

    return () => controller.abort();
  }, [token]);

  const genderLabel = name?.gender
    ? name.gender.charAt(0).toUpperCase() + name.gender.slice(1).toLowerCase()
    : "";

  return (
    <div className="rounded-2xl border border-[#02474F]/10 bg-[#D4E8EA]/70 p-5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#02474F]/50">
        {t("featuredName", "Featured Name")}
      </span>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          <div className="h-5 w-2/3 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="h-3 w-full rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
          <div className="h-3 w-1/2 rounded animate-pulse" style={{ backgroundColor: "#8AA5A81A" }} />
        </div>
      ) : name ? (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#02474F]/10 flex items-center justify-center shrink-0">
              <IconLetterA className="w-4 h-4 text-[#02474F]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#02474F]">
                {name.name}
              </p>
              {genderLabel && (
                <span className="text-[10px] text-[#02474F]/40 capitalize">{genderLabel}</span>
              )}
            </div>
          </div>
          {name.meaning && (
            <p className="text-xs text-[#02474F]/60 mt-2 line-clamp-2 leading-relaxed">
              {name.meaning}
            </p>
          )}
          <Link
            href="/dashboard/names"
            className="inline-block mt-2.5 text-[11px] font-medium text-[#0E808D] hover:text-[#0E808D]/80 transition-colors"
          >
            {t("exploreNames", "Explore Names")} &rarr;
          </Link>
        </div>
      ) : (
        <p className="text-xs text-[#02474F]/50 mt-3">
          {t("noNamesAvailable", "No names available.")}
        </p>
      )}
    </div>
  );
}
