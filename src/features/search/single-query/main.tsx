"use client";

import { Loader, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Definition from "./components/definition";
import SearchBar from "../components/search-bar";
import { useSingleWordResultQuery } from "../lib/api/searchApi";
import { safeDecodeURIComponent } from "../lib/helpers/safe-decode";

const SingleQueryFeature = ({
  slug,
  otaWord,
}: {
  slug: string;
  otaWord?: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const searchTerm = safeDecodeURIComponent(slug);
  const { data, isLoading } = useSingleWordResultQuery({ q: searchTerm });

  useEffect(() => {
    if (sessionStorage.getItem("search-cleared") === slug) {
      sessionStorage.removeItem("search-cleared");
      router.replace("/search");
    }
  }, [slug, router]);

  return (
    <div className="flex flex-col items-center w-full h-full font-sans pb-20 px-2">
      <div className="flex items-center gap-3 w-full max-w-4xl mt-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-[#02474F] hover:bg-[#02474F]/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
        <div className="flex-1">
          <SearchBar defaultValue={otaWord ?? searchTerm} forNav />
        </div>
      </div>

      <div className="max-w-4xl w-full rounded-2xl mt-10 px-5">
        {isLoading ? (
          <div className="w-full h-[40vh] flex justify-center items-center">
            <Loader
              size={40}
              strokeWidth={1.2}
              className="animate-spin text-primary"
            />
          </div>
        ) : (
          <Definition data={data ?? []} slug={otaWord ?? searchTerm} />
        )}
      </div>
    </div>
  );
};

export default SingleQueryFeature;
