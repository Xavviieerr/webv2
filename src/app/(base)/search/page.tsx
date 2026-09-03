import { BaseQueryFeature } from "@/features/search";
import React from "react";

const QueryPage = ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  return <BaseQueryFeature searchParams={searchParams} />;
};

export default QueryPage;
