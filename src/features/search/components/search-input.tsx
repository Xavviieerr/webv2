"use client";

import { useParams, useRouter } from "next/navigation";
import React, { RefObject, useState } from "react";
import { useQueryCtx } from "../lib/context";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "../hooks/use-search";
import { Keyboard, Loader, Search, X } from "lucide-react";
import { KeyboardURH, LocaleWrapper } from "@/features/shared";
import { useIsMobile } from "@/hooks/use-mobile";

const SearchInput = ({
  defaultValue,
  inputRef,
}: {
  defaultValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const router = useRouter();
  const params = useParams();

  const {
    setSearchTerm,
    showSuggestions,
    setShowSuggestions,
    saveToHistory,
    setEnterPressed,
    searchTerm,
    setResults,
    setIsLoading,
    setError,
    isLoading,
  } = useQueryCtx();

  const isMobile = useIsMobile();

  const { search, clearResults } = useSearch({
    setResults,
    setIsLoading,
    setError,
  });

  const debouncedValue = useDebounce(searchTerm.trim(), 500);

  React.useEffect(() => {
    if (!debouncedValue) {
      clearResults();
      return;
    }
    search(debouncedValue);
  }, [debouncedValue, search, clearResults]);

  const handleEnter = () => {
    setEnterPressed(true);
    setShowSuggestions(false);
    sessionStorage.removeItem("search-cleared");
    router.push(`/search?q=${searchTerm}`);
    saveToHistory(searchTerm);
  };

  return (
    <div className="flex items-center w-full">
      <Search
        strokeWidth={1.3}
        size={18}
        className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 max-md:hidden"
      />

      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onClick={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEnter();
            return;
          }
          if (!showSuggestions) setShowSuggestions(true);
        }}
        placeholder={LocaleWrapper({ item: "searchGuono" }) as string}
        className="py-3 pl-4 md:pl-10 pr-10 w-full outline-none rounded-full max-md:placeholder:text-sm placeholder:capitalize bg-backg"
      />

      <KeyboardURH
        isOpen={showKeyboard}
        value={searchTerm}
        handleChange={setSearchTerm}
        handleEnter={(value) => {
          if (value.trim() !== "") {
            handleEnter();
          }
        }}
        onClose={() => setShowKeyboard(false)}
        inputRef={inputRef}
      />

      <div className="flex gap-2 absolute right-3">
        {isLoading ? (
          <Loader size={18} className="text-gray-600 mt-1 animate-spin" />
        ) : (
          searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                clearResults();
                if (params.slug) {
                  sessionStorage.setItem("search-cleared", String(params.slug));
                }
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full hover:bg-secondary-foreground/10"
            >
              <X size={18} strokeWidth={1.3} />
            </button>
          )
        )}

        <button
          onClick={() => {
            if (isMobile && !showSuggestions) return setShowSuggestions(true);
            setShowKeyboard(!showKeyboard);
          }}
          className="p-1 rounded-full hover:bg-secondary-foreground/10 text-gray-600"
        >
          <Keyboard size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
