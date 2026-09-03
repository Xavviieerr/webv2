import { FiguresPediaFeature } from "@/features/guonopedia/figures-pedia";
import { IconLoaderQuarter } from "@tabler/icons-react";

import React, { Suspense } from "react";

const FiguresPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    createdBy?: string;
  }>;
}) => {
  const {
    page = "1",
    search = "",
    category = "",
    status = "",
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
      <FiguresPediaFeature
        query={{ page, search, category, status }}
      />
    </Suspense>
  );
};

export default FiguresPage;
