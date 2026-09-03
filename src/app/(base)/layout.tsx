import React, { ReactNode } from "react";

import { SearchNav } from "@/features/search/components/nav";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <SearchNav searchQuery={""} />
      <div className="flex-1 pt-8 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
