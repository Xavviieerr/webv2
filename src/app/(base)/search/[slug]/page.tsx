import { SingleQueryFeature } from "@/features/search/single-query";
import React from "react";

const SingleWordPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ otaWord?: string }>;
}) => {
  const slug = (await params).slug;
  const otaWord = (await searchParams).otaWord;
  return <SingleQueryFeature slug={slug} otaWord={otaWord} />;
};

export default SingleWordPage;
