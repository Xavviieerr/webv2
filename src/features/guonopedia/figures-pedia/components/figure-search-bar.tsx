"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLazySearchFiguresListQuery } from "@/features/search/lib/api/searchApi";
import { KeyboardURH } from "@/features/shared";
import { Keyboard, Loader, Search, User2, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const HISTORY_KEY = "searchHistory";
const MAX_HISTORY = 10;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function FigureSearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [history, setHistory] = useState<string[]>(loadHistory);

  const suggestionRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const debouncedValue = useDebounce(searchTerm.trim(), 500);
  const [triggerSearch, { data: suggestions = [], isLoading }] =
    useLazySearchFiguresListQuery();

  useEffect(() => {
    if (!debouncedValue) return;
    triggerSearch({ search: debouncedValue, limit: "5" });
  }, [debouncedValue, triggerSearch]);

  const saveToHistory = useCallback((word: string) => {
    const normalized = word.toLowerCase().trim();
    if (!normalized) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== normalized);
      const next =
        filtered.length >= MAX_HISTORY
          ? [normalized, ...filtered.slice(0, MAX_HISTORY - 1)]
          : [normalized, ...filtered];
      persistHistory(next);
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((word: string) => {
    const normalized = word.toLowerCase().trim();
    setHistory((prev) => {
      const next = prev.filter((item) => item !== normalized);
      persistHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persistHistory([]);
  }, []);

  const selectFigure = useCallback(
    (figure: { id: string; fullName: string }) => {
      saveToHistory(figure.fullName);
      setSearchTerm("");
      setShowSuggestions(false);
      router.push(`/dashboard/figures/${figure.id}`);
    },
    [router, saveToHistory],
  );

  const handleEnter = useCallback(() => {
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      saveToHistory(searchTerm);
    }
  }, [searchTerm, saveToHistory]);

  const showHistory = showSuggestions && !searchTerm && (history?.length ?? 0) > 0;
  const showResults =
    showSuggestions && searchTerm && (suggestions?.length ?? 0) > 0;

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
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchOutside);
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
  }, [showSuggestions, isMobile]);

  const input = (
    <div className="flex items-center w-full">
      <Search
        strokeWidth={1.3}
        size={18}
        className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 max-md:hidden"
      />
      <input
        type="text"
        ref={desktopInputRef}
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
        placeholder="Search for any Historical figure here..."
        className="py-3 pl-4 md:pl-10 pr-10 w-full outline-none rounded-full max-md:placeholder:text-sm placeholder:capitalize bg-backg"
      />
      <KeyboardURH
        isOpen={showKeyboard}
        value={searchTerm}
        handleChange={setSearchTerm}
        handleEnter={(value) => {
          if (value.trim() !== "") handleEnter();
        }}
        onClose={() => setShowKeyboard(false)}
        inputRef={desktopInputRef}
      />
      <div className="flex gap-2 absolute right-3">
        {isLoading ? (
          <Loader size={18} className="text-gray-600 mt-1 animate-spin" />
        ) : (
          searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                desktopInputRef.current?.focus();
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

  const suggestionBox = (
    <>
      {showHistory && (
        <div className="rounded-xl w-full md:shadow py-3 md:border border-gray-300 md:max-h-60 overflow-y-scroll bg-backg custom-scrollbar">
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between px-5">
              <p className="text-xs text-slate-600/70 underline underline-offset-3">
                Recent Searches
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
                  Clear all
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchTerm(word);
                    }}
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                      removeFromHistory(word);
                    }}
                    className="cursor-pointer hover:text-red-500 transition-colors"
                  >
                    <X strokeWidth={1.5} size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="flex flex-col gap-4 rounded-xl w-full md:shadow py-3 md:border border-gray-300 md:max-h-60 overflow-y-scroll z-50 bg-backg custom-scrollbar">
          <div className="flex flex-col w-full gap-2">
            <p className="text-xs text-slate-600/70 underline underline-offset-3 px-5">
              Notable Figures
            </p>
            <div className="flex flex-col px-2">
              {suggestions.map((figure) => (
                <button
                  key={figure.id}
                  onClick={() => selectFigure(figure)}
                  className="flex items-center gap-2 py-2 group hover:bg-secondary-foreground/10 cursor-pointer px-3 rounded-md"
                >
                  <User2
                    strokeWidth={1.2}
                    className="text-gray-500 mr-2 group-hover:text-primary shrink-0"
                    size={15}
                  />
                  <div className="flex flex-col items-start min-w-0">
                    <p className="font-medium capitalize">{figure.fullName}</p>
                    {figure.occupation && (
                      <p className="text-gray-500 text-xs capitalize">
                        {figure.occupation}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSuggestions && searchTerm && !isLoading && (suggestions?.length ?? 0) === 0 && (
        <div className="rounded-xl w-full md:shadow py-3 md:border border-gray-300 bg-backg p-4 text-center text-sm text-gray-500">
          No figures found for &ldquo;{searchTerm}&rdquo;
        </div>
      )}
    </>
  );

  return (
    <div
      ref={suggestionRef}
      className="flex items-center justify-center max-w-3xl w-full"
    >
      <div className="sticky top-16 z-40 flex flex-col gap-2 max-w-2xl w-full rounded-full">
        <div className="border border-secondary-foreground/30 relative flex items-center w-full max-md:border-b rounded-full">
          {input}
        </div>
        {suggestionBox}
      </div>

      {isMobile && showSuggestions && (
        <dialog className="absolute max-md:flex hidden flex-col items-center left-0 top-0 w-full h-screen bg-backg backdrop-blur-sm z-200 overflow-hidden no-scrollbar">
          <div className="flex items-center w-full px-3 border-b border-secondary-foreground/10">
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="md:hidden mr-2 p-2 -ml-1 rounded-full hover:bg-secondary-foreground/10"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
            <div className="flex items-center w-full">
              <Search
                strokeWidth={1.3}
                size={18}
                className="absolute left-6 text-gray-600"
              />
              <input
                type="text"
                ref={mobileInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onClick={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEnter();
                }}
                placeholder="Search for any Historical figure here..."
                className="py-3 pl-10 pr-10 w-full outline-none rounded-full placeholder:text-sm placeholder:capitalize bg-backg"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    mobileInputRef.current?.focus();
                  }}
                  className="absolute right-3 p-1 rounded-full hover:bg-secondary-foreground/10"
                >
                  <X size={18} strokeWidth={1.3} />
                </button>
              )}
            </div>
          </div>
          <div className="w-full px-3 mt-2">{suggestionBox}</div>
        </dialog>
      )}
    </div>
  );
}
