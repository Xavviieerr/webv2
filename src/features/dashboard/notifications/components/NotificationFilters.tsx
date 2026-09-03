"use client";

import { useTranslation } from "react-i18next";
import { IconFilter, IconChevronDown } from "@tabler/icons-react";
import type { NotificationQueryParams } from "../types";
import { NOTIFICATION_SORT_OPTIONS } from "../constants";

interface NotificationFiltersProps {
  activeType: string;
  sortBy: string;
  sortDir: string;
  availableTypes: string[];
  onTypeChange: (type: NotificationQueryParams["type"]) => void;
  onSortChange: (
    sortBy: NotificationQueryParams["sortBy"],
    sortDir: NotificationQueryParams["sortDir"],
  ) => void;
}

export function NotificationFilters({
  activeType,
  sortBy,
  sortDir,
  availableTypes,
  onTypeChange,
  onSortChange,
}: NotificationFiltersProps) {
  const { t } = useTranslation("common");
  const currentSort = `${sortBy}:${sortDir}`;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <IconFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#1A4349]/40 pointer-events-none" />
        <select
          value={activeType}
          onChange={(e) => onTypeChange(e.target.value as NotificationQueryParams["type"])}
          className="appearance-none rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] pl-8 pr-7 py-1.5 text-xs font-medium text-[#1A4349] transition-colors hover:bg-[#D4E8EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] cursor-pointer"
        >
          <option value="">{t("allTypes")}</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-[#1A4349]/40 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => {
            const [newSortBy, newSortDir] = e.target.value.split(":") as [
              NotificationQueryParams["sortBy"],
              NotificationQueryParams["sortDir"],
            ];
            onSortChange(newSortBy, newSortDir);
          }}
          className="appearance-none rounded-lg border border-[#1A4349]/15 bg-[#F9FAFB] px-3 pr-7 py-1.5 text-xs font-medium text-[#1A4349] transition-colors hover:bg-[#D4E8EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] cursor-pointer"
        >
          {NOTIFICATION_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.i18nKey)}
            </option>
          ))}
        </select>
        <IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-[#1A4349]/40 pointer-events-none" />
      </div>
    </div>
  );
}
