"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

const ImageGallery = ({ photos }: { photos: string[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <>
      <div className="w-full md:h-68 h-40 bg-secondary-foreground/20  rounded-md max-md:mb-5">
        <div className="relative w-full max-h-full h-full aspect-video max-md:border border-gray-50/50 border-dashed rounded-md">
          {photos.length > 0 && (
            <Image
              onClick={() => setOpen(true)}
              src={photos[selectedImage]}
              alt={""}
              fill
              unoptimized
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={selectedImage}
          slides={photos.map((item) => ({ src: item }))}
          plugins={[Counter]}
        />

        {photos.length == 0 && (
          <div className="flex flex-col justify-center items-center gap-5 w-full h-full border border-gray-50/50 border-dashed rounded-md">
            <ImageOff size={28} strokeWidth={1.2} />
            <p>No Profile Photo</p>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex w-full overflow-x-auto gap-2 no-scrollbar">
          {photos.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className="w-24 h-24 rounded hover:border border-secondary-foreground/50 cursor-pointer bg-secondary-foreground/20 relative shrink-0"
            >
              <Image
                src={item}
                alt={""}
                fill
                unoptimized
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
