"use client";
import React from "react";
import { useQueryCtx } from "../lib/context";
import { useSearchSuggestions } from "../hooks/use-search-suggestions";
import { BookOpenTextIcon, Clock, MapPin, SquareUser, User2, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const SuggestionBox = () => {
  const { t } = useTranslation("common");
  const {
    searchTerm,
    setSearchTerm,
    results,
    history,
    saveToHistory,
    removeFromHistory,
    clearHistory,
    showSuggestions: ctxShowSuggestions,
  } = useQueryCtx();

  const { showHistory, showResults, suggestionGroups } = useSearchSuggestions({
    searchTerm,
    results,
    history,
    showSuggestions: ctxShowSuggestions,
  });

  if (!ctxShowSuggestions) return null;

  if (showHistory) {
    return (
      <div className="rounded-xl w-full md:shadow py-3 md:border border-gray-300 md:max-h-60 overflow-y-scroll bg-backg custom-scrollbar">
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between px-5">
            <p className="text-xs text-slate-600/70 underline underline-offset-3">
              {t("recentSearches")}
            </p>
            {history.length > 0 && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  clearHistory();
                }}
                className="text-[11px] text-[#0E808D] hover:text-[#0E808D]/80 font-medium transition-colors underline underline-offset-2"
              >
                {t("clearAll", "Clear all")}
              </button>
            )}
          </div>

          <div className="flex flex-col px-2">
            {history.map((word) => (
              <div
                key={word}
                className="flex items-center gap-2 py-2 lowercase group hover:bg-secondary-foreground/10 px-3 rounded-md text-gray-500"
              >
                <button
                  onClick={() => setSearchTerm(word)}
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <Clock
                    strokeWidth={1.2}
                    className="mr-2 group-hover:text-primary"
                    size={15}
                  />
                  <p className="font-medium">{word}</p>
                </button>

                <button
                  onClick={() => removeFromHistory(word)}
                  className="cursor-pointer hover:text-red-500 transition-colors"
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

  if (!showResults) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl w-full md:shadow py-3 md:border border-gray-300 md:max-h-60 overflow-y-scroll z-50 bg-backg custom-scrollbar">
      {suggestionGroups.map((group) => (
        <div key={group.type} className="flex flex-col w-full gap-2">
          <p className="text-xs text-slate-600/70 underline underline-offset-3 px-5">
            {group.label}
          </p>

          <div className="flex flex-col px-2">
            {group.items.map((item) => {
              const Icon =
                group.type === "figures"
                  ? User2
                  : group.type === "names"
                    ? SquareUser
                    : group.type === "places"
                      ? MapPin
                      : BookOpenTextIcon;

              return (
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.historyKey) saveToHistory(item.historyKey);
                  }}
                  key={item.id}
                  className="flex items-center gap-2 py-2 lowercase group hover:bg-secondary-foreground/10 cursor-pointer px-3 rounded-md"
                >
                  <Icon
                    strokeWidth={1.2}
                    className="text-gray-500 mr-2 group-hover:text-primary"
                    size={15}
                  />
                  <p className="font-medium">{item.label}</p>
                  {item.sublabel && (
                    <p className="text-gray-500">- {item.sublabel}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionBox;
