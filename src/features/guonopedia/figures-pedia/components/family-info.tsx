import React from "react";
import { Figure } from "../lib/types";
import FamilyAccordion from "./family-accordion";

const FamilyInfoSection = ({ family }: { family: Figure["family"] }) => {
  if (!family || family.length === 0) return null;

  return (
    <div className="p-4 max-md:py-4 rounded-md bg-secondary-foreground/20 text-sm text-gray-900">
      <div className="bg-secondary-bg p-4 rounded-md text-sm">
        <p className="text-base pb-2 font-medium">Family Members</p>

        {family.map((familyMember, idx) => {
          return <FamilyAccordion key={idx} familyMember={familyMember} />;
        })}
      </div>
    </div>
  );
};

export default FamilyInfoSection;
