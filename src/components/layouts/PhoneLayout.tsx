"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "../ui/carousel";

// Use assets that exist in public/ so every slide shows (add guono-tree.png when available)
const CAROUSEL_SLIDES = [
  { src: "/guono-tree.png", alt: "Guọnọ — Urhobo language and culture" },
  { src: "/guono-tree.png", alt: "Guọnọ — Urhobo language and culture" },
  { src: "/guono-tree.png", alt: "Guọnọ — Urhobo language and culture" },
  { src: "/guono-tree.png", alt: "Guọnọ — Urhobo language and culture" },
];

export default function PhoneLayout() {
  const { i18n } = useTranslation("common");
  const language = useAppSelector(
    (state: RootState) => state.language.language
  );
  const prevLanguageRef = useRef<string>(language);

  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      if (i18n.language !== language && typeof i18n.changeLanguage === "function") {
        i18n.changeLanguage(language);
      }
      prevLanguageRef.current = language;
    }
  }, [language]);

  return (
    <div className="w-full h-screen hidden md:block relative overflow-hidden bg-white">
      <Carousel
        opts={{ align: "start", loop: true }}
        autoPlay
        autoPlayInterval={3000}
        className="w-full h-full"
      >
        <CarouselContent className="ml-0">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative h-screen w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index <= 1}   // preload first two
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  );
}