"use client";

import React from "react";
import Link from "next/link";
import {ArrowRight, User2} from "lucide-react";

interface FigureResultItemProps {
  figure: {
    id: string;
    fullName: string;
    occupation: string;
    introBio: string;
  };
}

export function FigureResultItem({figure}: FigureResultItemProps) {
  return (
    <Link
      href={`/dashboard/figures/${figure.id}`}
      className="flex flex-col w-full gap-1 group hover:border-b border-slate-600/20 cursor-pointer pb-3 transition-all"
    >
      <div className="flex items-center gap-2 text-base font-medium">
        <div className="bg-secondary-foreground/10 rounded-full p-2">
          <User2 strokeWidth={1.2} size={18} />
        </div>

        <div className="flex flex-col">
          <p className="group-hover:underline underline-offset-2">
            <span className="capitalize">{figure.fullName}</span>
            {" - "}
            <span className="text-gray-500 font-normal">{figure.occupation}</span>
          </p>
        </div>

        <ArrowRight strokeWidth={1.2} className="ml-auto group-hover:block hidden" />
      </div>

      <p className="text-sm text-slate-600/90 line-clamp-1">{figure.introBio}</p>
    </Link>
  );
}
