"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the current viewport is narrower than the given breakpoint.
 * Shared responsive helper; mirrors the previous per-component
 * `window.innerWidth < 768` listener behavior.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}
