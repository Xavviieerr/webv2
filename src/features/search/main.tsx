import React from "react";
import { SearchPage, SearchResults } from "./components";

const BaseQueryFeature = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q = "" } = await searchParams;

  return (
    <div className="flex w-full items-center font-plus-sans ">
      {!q && <SearchPage />}

      {q && <SearchResults q={q} />}
    </div>
  );
};

export default BaseQueryFeature;
