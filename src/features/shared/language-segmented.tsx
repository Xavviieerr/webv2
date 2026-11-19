"use client";

import { cn } from "@/lib/utils";
import { useLanguageSwitch, type Language } from "./use-language-switch";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "ENG" },
  { value: "urhobo", label: "URH" },
];

interface LanguageSegmentedProps {
  className?: string;
}

/**
 * Compact two-way language control used in the global utility bar. Rendered on
 * the dark teal band, so the active segment uses the pale gold token.
 */
export function LanguageSegmented({ className }: LanguageSegmentedProps) {
  const { language, changeLanguage } = useLanguageSwitch();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md bg-white/10 p-0.5",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const active = language === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => changeLanguage(option.value)}
            className={cn(
              "rounded-[5px] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
              active
                ? "bg-[#FBEDCA] text-[#02474F]"
                : "text-white/65 hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
