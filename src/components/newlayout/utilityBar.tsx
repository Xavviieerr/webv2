"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { LanguageSegmented } from "@/features/shared";
import { useAppSelector } from "@/types/hooks";

const CONTRIBUTOR_HUB_PATH = "/guonopedia/contribute";
const CONTRIBUTOR_APPLY_PATH = "/guonopedia/contribute/apply";

/**
 * Thin band above the main navigation. Carries the contributor invitation and
 * the language control, keeping both out of the primary navigation row.
 */
export function UtilityBar() {
  const { t } = useTranslation("common");
  const user = useAppSelector((state) => state.auth.user);

  // Signed-out visitors go straight into the application flow instead of
  // landing on a hub full of states they cannot act on yet.
  const contributorHref = user ? CONTRIBUTOR_HUB_PATH : CONTRIBUTOR_APPLY_PATH;

  return (
    <div className="w-full bg-[#02474F] text-white">
      <div className="mx-auto flex h-10 w-full max-w-[1700px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <p className="hidden truncate text-[13px] text-white/70 sm:block">
            {t("utilityContributorTitle")}
          </p>
          <span
            aria-hidden
            className="hidden h-4 w-px shrink-0 bg-white/20 sm:block"
          />
          <Link
            href={contributorHref}
            className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-white underline-offset-4 hover:underline"
          >
            {t("utilityContributorCta")}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <LanguageSegmented className="shrink-0" />
      </div>
    </div>
  );
}
