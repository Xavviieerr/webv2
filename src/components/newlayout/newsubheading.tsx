"use client";

import React from "react";
import Link from "next/link";

export default function NewSubHeading() {

  return (
    <div className="w-full bg-primary">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 max-w-[1700px] mx-auto">
        {/* Left: text + link - secondary (cream) color */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-secondary min-w-0">
          <span>Know Urhobo? Help document it.</span>
          <Link
            href="/careers"
            className="underline hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Become a Contributor
          </Link>
        </div>
      </div>
    </div>
  );
}
