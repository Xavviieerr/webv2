"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useWordCountTotalQuery } from "@/slice/wordEndpoints";
import { quickAccessItems } from "../constants/quickAccessItems";
import { useTranslation } from "react-i18next";

export function QuickAccessSection() {
  const router = useRouter();
  const { data: wordCountData } = useWordCountTotalQuery();
  const { t } = useTranslation("common");

  const dictionaryEntryCount =
    wordCountData?.data != null
      ? `${Number(wordCountData.data).toLocaleString()} ${t("entries")}`
      : `— ${t("entries")}`;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickAccessItems.map((item, index) => {
          const IconComponent = item.icon;
          if (!item.isReady) {
            return null;
          }
          const count = item.href === "/dashboard/dictionary" ? dictionaryEntryCount : t(item.countKey);
          return (
            <div
              key={index}
              onClick={() => {
                if (item.href) {
                  router.push(item.href);
                }
              }}
              className="group bg-[#D4E8EA] rounded-xl p-5 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100"
            >
              <div className="flex flex-col gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-medium text-[#0D4D4D] group-hover:text-[#1A4349] transition-colors">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(item.descriptionKey)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-xs text-gray-500">{count}</span>
                  <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
