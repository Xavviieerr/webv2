import QueryContextProvider from "@/features/search/lib/context";
import React from "react";

const QueryLayout = ({ children }: { children: React.ReactNode }) => {
  return <QueryContextProvider>{children}</QueryContextProvider>;
};

export default QueryLayout;
