import React from "react";
import SingleEntry from "./single-bio";
import { Figure } from "../lib/types";
import ExternalLinks from "./sources";

const ContentSection = ({ data }: { data: Figure }) => {
  const { biography, externalLinks, introBio } = data;

  const sortedEntries =
    biography.length > 0
      ? [...biography[0].entries].sort((a, b) => a.order - b.order)
      : [];
  return (
    <div className=" flex flex-col md:col-span-3 col-span-1 max-md:order-1 md:px-5 px-4 py-6 gap-4 text-justify h-fit md:bg-secondary-foreground/10 text-gray-700 rounded-md w-full">
      <p>{introBio}</p>

      {sortedEntries.length > 0 && (
        <div className="flex flex-col w-full">
          {sortedEntries.map((item, idx) => (
            <SingleEntry key={idx} entry={item} />
          ))}
        </div>
      )}

      <ExternalLinks sources={externalLinks} />
    </div>
  );
};

export default ContentSection;
