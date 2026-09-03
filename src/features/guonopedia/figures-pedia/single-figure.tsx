"use client";

import React from "react";
import { BasicInfoSection, ContentSection, ImageGallery } from "./components";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useGetSingleFigureQuery } from "@/features/search/lib/api/searchApi";
import FamilyInfoSection from "./components/family-info";
import { IconLoaderQuarter } from "@tabler/icons-react";

const SingleFigureFeature = ({ id }: { id: string }) => {
  const { data: figure, isLoading } = useGetSingleFigureQuery(id);

  if (isLoading)
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center bg-secondary-foreground-50 rounded-2xl border border-gray-100 py-8 lg:px-8 md:px-4 px-0">
        <IconLoaderQuarter
          size={48}
          className="animate-spin text-foreground-50"
        />
      </div>
    );

  if (!figure) return <p className="text-white">No matching figure found</p>;

  const { biography, profilePhoto } = figure;

  const photos =
    biography.length > 0 && biography[0].entries.length > 0
      ? [profilePhoto, ...biography[0].entries.flatMap((entry: any) => entry.photos)]
      : [profilePhoto];

  return (
    <div className="flex flex-col items-start w-full h-full py-10 px-0 font-plus-sans ">
      <div className="w-full flex flex-col lg:gap-10 gap-5 py-8 ">
        <Link
          href={"/dashboard/figures"}
          className="flex items-center gap-4 text-primary"
        >
          <ChevronLeft />

          <h3 className="text-2xl max-md:text-xl font-medium capitalize">
            {figure.fullName}
          </h3>
        </Link>

        <div className="grid md:grid-cols-5 grid-cols-1 w-full md:gap-6 gap-y-6 text-white">
          <ContentSection data={figure} />

          <div className="flex flex-col col-span-2 rounded-md w-full h-fit md:gap-5 gap-3">
            <ImageGallery photos={photos} />

            <BasicInfoSection data={figure} />

            <FamilyInfoSection family={figure.family} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFigureFeature;
