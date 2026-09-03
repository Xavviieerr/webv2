import { NamesPediaFeature } from "@/features/guonopedia/names-pedia";
import { IconLoaderQuarter } from "@tabler/icons-react";

import React, { Suspense } from "react";

const NamesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    type: string;
    gender: "neutral" | "male" | "female" | "all";
    search: string;
    page: string;
  }>;
}) => {
  const {
    type = "all",
    gender = "all",
    search = "",
    page = "1",
  } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] w-full flex items-center justify-center py-8 lg:px-8 md:px-4 px-0">
          <IconLoaderQuarter
            size={48}
            className="animate-spin text-foreground-50"
          />
        </div>
      }
    >
      <NamesPediaFeature
        query={{
          type,
          gender,
          search,
          page,
        }}
      />
    </Suspense>
  );
};

export default NamesPage;
