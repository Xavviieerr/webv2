"use client";

import { useTranslation } from "react-i18next";
import { IconMessageDots } from "@tabler/icons-react";

export function CommunityEmptyState() {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
        <IconMessageDots className="w-8 h-8 text-[#0E808D]" />
      </div>
      <h3 className="text-lg font-semibold text-[#0D4D4D]">
        {t("noPostsYet", "No posts yet")}
      </h3>
      <p className="text-sm text-[#0D4D4D]/60 mt-1 max-w-xs">
        {t("beTheFirstToPost", "Be the first to start a conversation in the community.")}
      </p>
    </div>
  );
}
