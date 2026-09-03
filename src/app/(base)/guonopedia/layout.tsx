"use client";

import QueryContextProvider from "@/features/search/lib/context";
import type { ReactNode } from "react";

const GuonopediaLayout = ({ children }: { children: ReactNode }) => {
  return <QueryContextProvider>{children}</QueryContextProvider>;
};

export default GuonopediaLayout;
