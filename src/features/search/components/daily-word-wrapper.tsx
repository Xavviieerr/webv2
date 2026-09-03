"use client";
import React, { ReactNode } from "react";
import { useQueryCtx } from "../lib/context";

const DailyWordWrapper = ({ children }: { children: ReactNode }) => {
  const { showSuggestions } = useQueryCtx();

  return <>{!showSuggestions && children}</>;
};

export default DailyWordWrapper;
