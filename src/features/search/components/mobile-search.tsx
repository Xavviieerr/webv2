"use client";

import React, { RefObject, useEffect } from "react";
import { useQueryCtx } from "../lib/context";
import { X } from "lucide-react";
import SearchInput from "./search-input";
import SuggestionBox from "./suggestion-box";
import { useTranslation } from "react-i18next";

const MobileSearch = ({
  defaultValue,
  inputRef,
}: {
  defaultValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const { showSuggestions, setShowSuggestions } = useQueryCtx();
  const { t } = useTranslation("common");

  useEffect(() => {
    showSuggestions && inputRef.current?.focus();
  }, [showSuggestions]);

  if (!showSuggestions) return null;

  return (
    <dialog
      className={`absolute max-md:flex hidden flex-col items-center left-0 top-0 w-full h-screen bg-backg backdrop-blur-sm z-200 overflow-hidden no-scrollbar`}
    >
      <div className="flex items-center w-full px-3 border-b border-secondary-foreground/10">
        <button
          type="button"
          onClick={() => setShowSuggestions(false)}
          className="md:hidden mr-2 p-2 -ml-1 rounded-full hover:bg-secondary-foreground/10"
          aria-label={t("closeSearch")}
        >
          <X size={20} />
        </button>
        <SearchInput
          defaultValue={defaultValue}
          inputRef={inputRef}
        />
      </div>

      <SuggestionBox />
    </dialog>
  );
};

export default MobileSearch;
