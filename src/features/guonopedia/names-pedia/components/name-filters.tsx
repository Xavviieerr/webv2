"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TYPE_FILTERS, GENDER_FILTERS } from "../constants";

interface NameFiltersProps {
  type: string;
  gender: string;
}

export function NameFilters({ type, gender }: NameFiltersProps) {
  return (
    <div className="flex max-md:flex-col md:items-center justify-between gap-4 w-full lg:my-10 my-4 text-sm">
      <div className="flex items-center ">
        {TYPE_FILTERS.map((name, i) => (
          <Link
            href={`?type=${name.value}&gender=${gender}`}
            scroll={false}
            key={i}
            className={`${type === name.value ? "border-primary text-primary" : "text-gray-500 border-gray-300"} px-5 max-md:text-sm text-base font-medium border-b-2 shrink-0 pb-2 cursor-pointer transition-all duration-500`}
          >
            {name.label}
          </Link>
        ))}
      </div>

      <div className="relative group self-end ">
        <button className="flex items-center gap-2 border border-gray-300 focus:border-primary rounded-lg px-5 py-2 focus:outline-none">
          <span className="capitalize">
            {gender == "all" ? "Gender" : gender}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="absolute hidden group-hover:flex flex-col gap-2 w-32 bg-white border border-gray-300 rounded-lg">
          {GENDER_FILTERS.map((item) => (
            <Link
              key={item.value}
              href={`?type=${type}&gender=${item.value}`}
              scroll={false}
              className="text-left px-4 py-2 hover:bg-gray-100 capitalize"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
