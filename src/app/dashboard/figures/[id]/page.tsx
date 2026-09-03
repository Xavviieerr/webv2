import { SingleFigureFeature } from "@/features/guonopedia/figures-pedia";
import React from "react";

const FigureDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const param = await params;
  return <SingleFigureFeature id={param.id} />;
};

export default FigureDetailsPage;
