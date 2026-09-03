"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { SingleName } from "@/features/shared/types";

const NameTranslation = ({
  translations,
}: {
  translations: SingleName["translations"];
}) => {
  const [index, setIndex] = useState(1);
  const total = translations?.length ?? 0;

  const next = () => {
    if (index < total) {
      setIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (index > 1) {
      setIndex((prev) => prev - 1);
    }
  };
  return (
    <div className="flex flex-col w-full bg-secondary-foreground/10 text-gray-900 rounded-2xl p-5 gap-5 h-fit">
      <p className="text-primary text-lg font-medium">Translations</p>

      {translations?.length > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Name</p>
            <p className="text-gray-800 capitalize">
              {translations[index - 1].translatedMeaning}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-medium">Notes</p>
            <p className="text-gray-800">{translations[index - 1].notes}</p>
          </div>

          {total > 1 && (
            <div className="flex w-full justify-end items-center gap-4 mt-5 text-base font-medium">
              <button
                onClick={prev}
                disabled={index <= 1}
                className={`border ${index <= 1 ? "border-gray-300 text-gray-400" : "border-primary text-primary"} hover:border-2 transition-all duration-300 ease-in-out px-3 py-2 rounded-lg`}
              >
                <ChevronLeft size={20} strokeWidth={1.2} />
              </button>

              <p>
                {index}/{total}
              </p>
              <button
                onClick={next}
                disabled={index >= total}
                className={`border ${index >= total ? "border-gray-300 text-gray-400" : "border-primary text-primary"} hover:border-2 transition-all duration-300 ease-in-out px-3 py-2 rounded-lg`}
              >
                <ChevronRight size={20} strokeWidth={1.2} />
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There is nothing to see here...</p>
      )}
    </div>
  );
};

export default NameTranslation;
