"use client";

import React from "react";
import Link from "next/link";
import {MapPin} from "lucide-react";
import type {PlaceListItem} from "@/features/dashboard/places/types";

interface PlaceResultItemProps {
  place: PlaceListItem;
}

export function PlaceResultItem({place}: PlaceResultItemProps) {
  const locationParts = place.location
    ? [place.location.city, place.location.state, place.location.country].filter(Boolean)
    : [];

  return (
    <Link
      href={`/dashboard/places/${place.id}`}
      className="flex flex-col w-full gap-1 group hover:border-b border-slate-600/20 cursor-pointer pb-3 transition-all"
    >
      <div className="flex items-center gap-2 text-base font-medium">
        <div className="bg-secondary-foreground/10 rounded-full p-2">
          <MapPin strokeWidth={1.2} size={18} />
        </div>
        <div className="flex flex-col">
          <p className="group-hover:underline underline-offset-2">
            <span>{place.name}</span>
            {" - "}
            <span className="text-gray-500 font-normal">{place.type}</span>
          </p>
        </div>
      </div>
      {locationParts.length > 0 && (
        <p className="text-sm text-slate-600/90 line-clamp-1 pl-10">
          {locationParts.join(", ")}
        </p>
      )}
    </Link>
  );
}
