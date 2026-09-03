"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const router = useRouter();
  const path = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm.trim(), 500);
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") || "";

  useEffect(() => {
    router.replace(`${path}?search=${debouncedValue}`, {
      scroll: false,
    });
  }, [debouncedValue]);
  return (
    <div className="flex items-center gap-3 w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-full px-5 py-3 border border-gray-300 focus:border-primary focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
