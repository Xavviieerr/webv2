"use client";

import { useEffect, useRef } from "react";
import { useQueryCtx } from "../lib/context";
import SuggestionBox from "./suggestion-box";
import SearchInput from "./search-input";
import MobileSearch from "./mobile-search";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SearchBar({
  defaultValue = "",
  forNav = false,
}: {
  defaultValue?: string;
  forNav?: boolean;
}) {
  const { showSuggestions, setShowSuggestions } = useQueryCtx();

  const isMobile = useIsMobile();

  const suggestionRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    const handleTouchOutside = (event: TouchEvent) => {
      if (
        desktopInputRef.current &&
        !desktopInputRef.current.contains(event.target as Node)
      ) {
        desktopInputRef.current.blur();
      }
    };

    document.addEventListener("touchstart", handleTouchOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleTouchOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobile && showSuggestions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSuggestions]);

  return (
    <div
      ref={suggestionRef}
      className="flex items-center justify-center max-w-3xl w-full"
    >
      <div
        className={`${forNav ? "lg:fixed lg:top-3 lg:z-200 " : "sticky top-16 z-40"} flex flex-col gap-2 max-w-2xl w-full rounded-full`}
      >
        <div className="border border-secondary-foreground/30 relative flex items-center w-full max-md:border-b rounded-full">
          <SearchInput
            defaultValue={defaultValue}
            inputRef={desktopInputRef}
          />
        </div>

        <SuggestionBox />
      </div>

      <MobileSearch
        defaultValue={defaultValue}
        inputRef={mobileInputRef}
      />
    </div>
  );
}
