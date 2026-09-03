"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Figure } from "../lib/types";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

const SingleEntry = ({
  entry,
}: {
  entry: Figure["biography"][number]["entries"][number];
}) => {
  const [open, setOpen] = useState(true);
  const [slidesOpen, setSlidesOpen] = useState(false);

  const [mainImage, ...restImages] = entry.photos;

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center font-medium justify-between gap-4 border-b border-gray-500/40 py-4 cursor-pointer max-md:test-sm"
      >
        <p>{entry.title}</p>

        <ChevronDown
          strokeWidth={1.4}
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="w-full mt-5">
          {mainImage && (
            <div className="flex max-md:w-full w-40 flex-col md:float-left md:mr-5 gap-y-3">
              <Image
                onClick={() => setSlidesOpen(true)}
                src={mainImage}
                alt={entry.title}
                width={256}
                height={320}
                unoptimized
                className="rounded-md w-full h-auto object-cover"
              />
            </div>
          )}
          <Lightbox
            open={slidesOpen}
            close={() => setSlidesOpen(false)}
            slides={entry.photos.map((item) => ({ src: item }))}
            plugins={[Counter]}
          />
          <p className="w-full text-sm text-justify max-md:pt-4">
            {entry.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleEntry;
