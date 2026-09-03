import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

const TypeFilter = ({ type }: { type: string }) => {
  return (
    <div className="relative group max-md:w-full shrink-0">
      <button className="flex items-center gap-2 border border-gray-300 focus:border-primary rounded-lg px-5 py-2 focus:outline-none">
        <span className="capitalize">
          {type == "all" ? "All Figures" : type}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <div className="absolute hidden group-hover:flex flex-col gap-2 bg-white border border-gray-300 w-40 rounded-lg  text-sm">
        {[
          "Historical Ruler",
          "Warrior",
          "Musician",
          "Politician",
          "Business Man",
        ].map((type) => (
          <Link
            href={`?type=${encodeURIComponent(type)}`}
            scroll={false}
            className="text-left px-4 py-2 hover:bg-gray-100"
          >
            {type}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
