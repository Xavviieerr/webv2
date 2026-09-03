"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Figure } from "../lib/types";

const FamilyAccordion = ({
  familyMember,
}: {
  familyMember: Figure["family"][0];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 border-b border-gray-500/40 py-3 cursor-pointer max-md:test-sm"
      >
        <p className="capitalize font-medium">{familyMember.name}</p>

        <ChevronDown
          strokeWidth={1.4}
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="w-full flex flex-col mt-3 border-b border-gray-500/40 pb-2">
          <div className="grid grid-cols-2 w-full gap-4">
            {familyMember.relationship && (
              <div className="flex flex-col gap-1">
                <p>Relation:</p>
                <p className="capitalize">{familyMember.relationship}</p>
              </div>
            )}

            {familyMember.occupation && (
              <div className="flex flex-col gap-1">
                <p>Occupation:</p>
                <p className="capitalize">{familyMember.occupation}</p>
              </div>
            )}

            {familyMember.dateOfBirth && (
              <div className="flex flex-col gap-1">
                <p>Date of Birth:</p>
                <p className="capitalize">{familyMember.dateOfBirth}</p>
              </div>
            )}

            {familyMember.dateOfDeath && (
              <div className="flex flex-col gap-1">
                <p>Date of Death:</p>
                <p className="capitalize">{familyMember.dateOfDeath}</p>
              </div>
            )}

            {familyMember.marriageYear && (
              <div className="flex flex-col gap-1">
                <p>Marriage Year:</p>
                <p className="capitalize">{familyMember.marriageYear}</p>
              </div>
            )}

            {familyMember.divorceYear && (
              <div className="flex flex-col gap-1">
                <p>Divorce Year:</p>
                <p className="capitalize">{familyMember.divorceYear}</p>
              </div>
            )}
          </div>

          {familyMember.bio && (
            <p className="w-full text-sm text-justify max-md:pt-4 mt-5 whitespace-pre-wrap">
              {familyMember.bio}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyAccordion;
