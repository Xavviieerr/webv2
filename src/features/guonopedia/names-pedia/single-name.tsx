"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NameTranslation } from "./components";
import { useGetSingleNameQuery } from "@/features/search/lib/api/searchApi";
import { ROUTE_NAMES } from "./constants";
import { EmptyState } from "./components/empty-state";
import { NameDetailCard } from "./components/name-detail-card";
import { IconLoaderQuarter } from "@tabler/icons-react";

const SingleNameFeature = ({ id }: { id: string }) => {
  const { data: data, isLoading } = useGetSingleNameQuery(id);

  if (isLoading)
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center rounded-2xl py-8 lg:px-8 md:px-4 px-0">
        <IconLoaderQuarter
          size={48}
          className="animate-spin text-foreground-50"
        />
      </div>
    );

  if (!data)
    return (
      <div className="mt-[20vh]">
        <EmptyState />
      </div>
    );

  return (
    <div className="flex flex-col items-start w-full h-full py-10 px-0 font-plus-sans">
      <div className="w-full flex flex-col lg:gap-10 gap-5 bg-secondary-foreground-50 rounded-2xl border border-gray-100 py-8 lg:px-8 px-4">
        <Link
          href={ROUTE_NAMES}
          className="flex items-center gap-4 text-primary"
        >
          <ChevronLeft />

          <h3 className="text-2xl max-md:text-xl font-medium capitalize">
            {data.name}
          </h3>
        </Link>

        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5 text-gray-900">
          {/* Details */}
          <NameDetailCard
            nameType={data.nameType}
            gender={data.gender}
            regionOfUse={data.regionOfUse}
            culturalSignificance={data.culturalSignificance}
            nameComposition={data.nameComposition}
          />

          {/* Translations */}
          <NameTranslation translations={data.translations} />
        </div>
      </div>
    </div>
  );
};

export default SingleNameFeature;
