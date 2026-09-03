"use client";

import { Search } from "lucide-react";
import type { SearchSuggestionItem } from "../types/search";

interface SearchSuggestionsListProps {
  loading: boolean;
  items: SearchSuggestionItem[];
  activeIndex: number;
  loadingLabel: string;
  emptyLabel: string;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  onActiveIndexChange: (index: number) => void;
  onPick: (label: string) => void;
}

/**
 * Presentational autocomplete dropdown for GenericSearchComponent.
 * Renders loading / empty / suggestion states; keyboard highlight handled by parent.
 */
export function SearchSuggestionsList({
  loading,
  items,
  activeIndex,
  loadingLabel,
  emptyLabel,
  itemRefs,
  onActiveIndexChange,
  onPick,
}: SearchSuggestionsListProps) {
  return (
    <div
      tabIndex={0}
      className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40 max-h-[280px] overflow-y-auto"
    >
      {loading ? (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          {loadingLabel}
        </div>
      ) : items.length > 0 ? (
        <ul className="">
          {items.map((item, index) => {
            if (!item) return <></>;

            return (
              <li
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onMouseEnter={() => onActiveIndexChange(index)}
              >
                <button
                  type="button"
                  onClick={() => onPick(item.label)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${index === activeIndex ? "bg-primary text-white" : "text-gray-900"}`}
                >
                  <Search
                    className="w-4 h-4 shrink-0"
                    style={{
                      color:
                        index === activeIndex ? "white" : "#8AA5A8",
                    }}
                  />
                  <span className="font-medium ">{item.label}</span>
                  <span
                    className="w-px h-3 bg-gray-200 shrink-0"
                    aria-hidden
                  />
                  <span
                    className={`text-sm ${index === activeIndex ? "text-white" : "text-gray-600"}`}
                  >
                    {item.captions.join(", ")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}