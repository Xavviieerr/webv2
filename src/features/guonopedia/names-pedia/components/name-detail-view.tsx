"use client";

import { ArrowLeft } from "lucide-react";
import { formatNameType, getGenderColor } from "../utils";
import NameTranslation from "./translation";
import type { NameItem } from "../types";

export function NameDetailView({
  name,
  onBack,
}: {
  name: NameItem;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-start w-full h-full py-10 px-0 font-plus-sans">
      <div className="w-full flex flex-col lg:gap-10 gap-5 bg-secondary-foreground-50 rounded-2xl border border-gray-100 py-8 lg:px-8 px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors self-start"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
          <span className="text-sm font-medium">Back to Names</span>
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl max-md:text-2xl font-semibold text-primary capitalize">
            {name.name}
          </h1>
          {name.pronunciation && (
            <p className="text-lg text-gray-500">{name.pronunciation}</p>
          )}
        </div>

        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5 text-gray-900">
          <div className="flex flex-col w-full bg-secondary-foreground/10 rounded-2xl p-5 gap-8">
            <p className="text-primary text-lg font-medium">Name Details</p>

            <div className="w-full grid grid-cols-3 gap-5 max-md:text-sm">
              <div className="flex flex-col gap-2">
                <p className="font-medium">Type</p>
                <p className="text-gray-800 capitalize">
                  {formatNameType(name.nameType)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-medium">Gender</p>
                <span
                  className={`text-xs px-3 py-1 rounded-xl border border-dashed capitalize font-medium w-fit ${getGenderColor(name.gender)}`}
                >
                  {name.gender}
                </span>
              </div>
              {name.source && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Source</p>
                  <p className="text-gray-800 capitalize">{name.source}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium">Cultural Significance</p>
              <p className="text-gray-800">
                {name.culturalSignificance || "N/A"}
              </p>
            </div>

            {name.createdBy && (
              <div className="flex flex-col gap-2">
                <p className="font-medium">Added by</p>
                <p className="text-gray-800">
                  {name.createdBy.username || name.createdBy.firstName}
                </p>
              </div>
            )}
          </div>

          <NameTranslation translations={name.translations} />
        </div>
      </div>
    </div>
  );
}
