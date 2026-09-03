"use client";

import React, { useEffect, useRef, KeyboardEvent } from "react";
import { Search, Keyboard, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { useLazyAutocompleteQuery } from "@/slice/endpoints";
import { setSearchQuery, setSearchResults } from "@/slice/wordSlice";


interface SearchResult {
  word: string;
  eyuo?: string;
}



const SearchBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [fetchAutocomplete] = useLazyAutocompleteQuery();
  const inputRef = useRef<HTMLInputElement>(null);

  const { searchQuery, searchResults } = useAppSelector((state) => state.word);


  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  // NOTE: "/newWordDetails" has no matching route under src/app — these
  // navigations resolve to a 404. Do not "fix" this silently; it was flagged
  // during the dictionary refactor audit (Step 0 restore, decision pending).
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      dispatch(setSearchResults([]));
      dispatch(setSearchQuery(""));
      router.push(`/newWordDetails?term=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleWordClick = (word: string) => {
    dispatch(setSearchResults([]));
    dispatch(setSearchQuery(""));
    router.push(`/newWordDetails?term=${encodeURIComponent(word)}`);
  };

  // Autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await fetchAutocomplete({ q: searchQuery }).unwrap();
        if (Array.isArray(result)) {
          dispatch(
            setSearchResults(
              result.map((item, index) => ({
                ...item,
                id: typeof item.id === "number" ? item.id : index,
              }))
            )
          );
        }
      } catch {
        dispatch(setSearchResults([]));
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch, fetchAutocomplete]);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 rounded-full px-4 py-3 transition-all ${
          searchQuery ? "bg-[#0A2E30] text-white" : "bg-white"
        }`}
      >
        <Search className="w-5 h-5" />

        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("searchGuono")}
          className="flex-1 bg-transparent outline-none"
        />

        {searchQuery && (
          <button
            onClick={() => {
              dispatch(setSearchQuery(""));
              dispatch(setSearchResults([]));
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <Keyboard className="w-5 h-5 opacity-60" />
      </div>

   {searchQuery && searchResults.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A2E30] rounded-xl z-50">
    {searchResults.map((item: SearchResult, i: number) => (
      <div
        key={i}
        onMouseDown={() => handleWordClick(item.word)}
        className="px-4 py-2 cursor-pointer hover:bg-[#1C4A4D]"
      >
        <div className="font-semibold">{item.word}</div>
        {item.eyuo && (
          <div className="text-sm opacity-60">{item.eyuo}</div>
        )}
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default SearchBar;
