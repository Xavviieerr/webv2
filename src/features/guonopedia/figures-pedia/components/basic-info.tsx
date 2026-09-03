import { formatCamelCase } from "@/helpers";
import React, { Fragment } from "react";
import { Figure } from "../lib/types";

const BasicInfoSection = ({ data }: { data: Figure }) => {
  const keyValuePairs = Object.entries(data).map(([key, value]) => {
    if (
      !value ||
      typeof value !== "string" ||
      (Array.isArray(value) && value.length < 1)
    )
      return null;

    if (
      [
        "id",
        "slug",
        "profilePhoto",
        "shortBio",
        "introBio",
        "externalLinks",
        "status",
        "submissionType",
        "createdById",
        "approvedBy",
        "approvedAt",
        "createdAt",
        "updatedAt",
      ].includes(key)
    )
      return null;

    return { key, value };
  });
  return (
    <div className="p-4 max-md:py-4 rounded-md bg-secondary-foreground/20 text-sm text-gray-900">
      {keyValuePairs.map((item, idx) => {
        if (!item) return <Fragment key={idx} />;

        return (
          <div
            key={idx}
            className="flex items-start gap-4 justify-between py-4 border-b border-secondary-foreground/20"
          >
            <p className="capitalize">{formatCamelCase(item.key)}:</p>
            {Array.isArray(item.value) ? (
              <p className="text-right font-medium">{item.value.join(", ")}</p>
            ) : (
              <p className="text-right font-medium">{item.value}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BasicInfoSection;
