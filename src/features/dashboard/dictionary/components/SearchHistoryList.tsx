"use client";

import { Clock, X } from "lucide-react";

interface SearchHistoryListProps {
  terms: string[];
  activeIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  onActiveIndexChange: (index: number) => void;
  onPick: (term: string) => void;
  onRemove: (term: string, e: React.MouseEvent) => void;
  onClearAll?: () => void;
}

/**
 * Presentational search-history dropdown for GenericSearchComponent.
 * Matches the GuonopediaLanding search history dropdown design.
 */
export function SearchHistoryList({
  terms,
  activeIndex,
  containerRef,
  itemRefs,
  onActiveIndexChange,
  onPick,
  onRemove,
  onClearAll,
}: SearchHistoryListProps) {
  return (
    <div
      tabIndex={0}
      ref={containerRef}
      className="absolute left-0 right-0 top-full mt-1 rounded-xl md:shadow py-3 md:border border-gray-300 md:max-h-60 overflow-y-scroll bg-backg custom-scrollbar z-40"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center justify-between px-5">
          <p className="text-xs text-slate-600/70 underline underline-offset-3">
            Recent Searches
          </p>
          {terms.length > 0 && onClearAll && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onClearAll();
              }}
              className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-col px-2">
          {terms.map((term, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onMouseEnter={() => onActiveIndexChange(index)}
              className={`flex items-center gap-2 py-2 lowercase group hover:bg-secondary-foreground/10 px-3 rounded-md text-gray-500 transition-colors ${index === activeIndex ? "bg-secondary-foreground/10" : ""}`}
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(term);
                }}
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                <Clock
                  strokeWidth={1.2}
                  className="mr-2 group-hover:text-primary shrink-0"
                  size={15}
                />
                <p className="font-medium truncate">{term}</p>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(term, e);
                }}
                className="cursor-pointer hover:text-red-500 transition-colors shrink-0"
                aria-label="Remove from history"
              >
                <X strokeWidth={1.5} size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
