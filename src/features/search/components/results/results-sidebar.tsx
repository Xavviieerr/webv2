"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {User2, MapPin} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {PlaceListItem} from "@/features/dashboard/places/types";

interface ResultsSidebarProps {
  figures: Array<{
    id: string;
    fullName: string;
    occupation: string;
    introBio: string;
    profilePhoto?: string | null;
  }>;
  names: Array<{
    id: string;
    name: string;
    nameType: string;
    translations: Array<{translatedMeaning: string; notes: string}>;
  }>;
  places: PlaceListItem[];
}

export function ResultsSidebar({figures, names, places}: ResultsSidebarProps) {
  const {t} = useTranslation("common");

  return (
    <div className="md:flex hidden flex-col gap-4">
      {figures.length > 0 && (
        <div className="flex flex-col max-w-md w-full bg-secondary-foreground/10 h-fit rounded-2xl p-5 gap-3">
          <h2 className="text-base font-medium">{t("featuredFigures")}</h2>
          {figures.slice(0, 2).map((figure) => (
            <Link
              href={`/dashboard/figures/${figure.id}`}
              key={figure.id}
              className="flex items-start cursor-pointer gap-2 hover:border bg-secondary-foreground/5 rounded-2xl border-primary/20 transition-all duration-300 ease-in-out text-base"
            >
              <div className="w-20 h-full bg-secondary-foreground/20 relative rounded-l-2xl shrink-0">
                {figure.profilePhoto ? (
                  <Image src={figure.profilePhoto} alt="figure" fill unoptimized className="rounded-l-2xl" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-base-dark">
                    <User2 size={52} strokeWidth={1.2} />
                  </div>
                )}
              </div>

              <div className="flex flex-col md:py-5 py-3 px-3">
                <p className="font-semibold text-primary capitalize">
                  {figure.fullName} - <span className="font-normal">{figure.occupation}</span>
                </p>
                <div className="flex flex-col gap-1 max-md:hidden items-start text-sm">
                  <p className="line-clamp-1 text-gray-900">{figure.introBio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {names.length > 0 && (
        <div className="flex flex-col max-w-md w-full bg-secondary-foreground/10 h-fit rounded-2xl p-5 gap-3">
          <h2 className="text-base font-medium">{t("featuredNames")}</h2>
          {names.slice(0, 2).map((name) => (
            <Link
              href={`/dashboard/names/${name.id}`}
              key={name.id}
              className="flex items-start cursor-pointer gap-2 hover:border bg-secondary-foreground/5 rounded-2xl border-primary/20 transition-all duration-300 ease-in-out text-base"
            >
              <div className="flex flex-col md:py-5 py-3 px-3">
                <p className="font-semibold text-primary capitalize">
                  {name.name} -{" "}
                  <span className="text-gray-500 font-normal text-sm">
                    {name.translations.length > 0
                      ? name.translations.map((t) => t.translatedMeaning).join(", ")
                      : name.nameType}
                  </span>
                </p>
                <div className="flex flex-col gap-1 max-md:hidden items-start text-sm">
                  {name.translations.length > 0 && (
                    <p className="text-sm text-slate-600/90 line-clamp-1">{name.translations[0].notes}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {places.length > 0 && (
        <div className="flex flex-col max-w-md w-full bg-secondary-foreground/10 h-fit rounded-2xl p-5 gap-3">
          <h2 className="text-base font-medium">{t("featuredPlaces")}</h2>
          {places.slice(0, 2).map((place) => (
            <Link
              href={`/dashboard/places/${place.id}`}
              key={place.id}
              className="flex items-start cursor-pointer gap-2 hover:border bg-secondary-foreground/5 rounded-2xl border-primary/20 transition-all duration-300 ease-in-out text-base"
            >
              <div className="w-20 h-full bg-secondary-foreground/20 relative rounded-l-2xl shrink-0">
                {place.coverImage ? (
                  <Image src={place.coverImage} alt="place" fill unoptimized className="rounded-l-2xl" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-base-dark">
                    <MapPin size={52} strokeWidth={1.2} />
                  </div>
                )}
              </div>

              <div className="flex flex-col md:py-5 py-3 px-3">
                <p className="font-semibold text-primary capitalize">
                  {place.name} - <span className="font-normal">{place.type}</span>
                </p>
                <div className="flex flex-col gap-1 max-md:hidden items-start text-sm">
                  {place.location && (
                    <p className="line-clamp-1 text-gray-900">
                      {[place.location.city, place.location.state, place.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
