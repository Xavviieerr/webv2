"use client";

import React from "react";
import type { KeyboardEvent } from "react";
import { Search, X, Keyboard } from "lucide-react";
import { KeyboardURH } from "@/features/shared";

interface SearchInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isMobile: boolean;
  value: string;
  placeholder: string;
  showClear: boolean;
  showKeyboard: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyboardToggle: () => void;
  onKeyboardChange: (value: string) => void;
  onKeyboardEnter: (value: string) => void;
  onKeyboardClose: () => void;
}

/**
 * Pill-shaped search input with clear + keyboard-toggle controls and the
 * on-screen Urhobo keyboard overlay. Pure presentation; all behavior is
 * delegated up through props.
 */
export const SearchInput = ({
  inputRef,
  isMobile,
  value,
  placeholder,
  showClear,
  showKeyboard,
  onChange,
  onFocus,
  onClick,
  onKeyDown,
  onClear,
  onKeyboardToggle,
  onKeyboardChange,
  onKeyboardEnter,
  onKeyboardClose,
}: SearchInputProps) => {
  return (
    <>
      <div
        className="rounded-full border shadow-sm flex items-center px-4 py-3 min-h-[56px]"
        style={{ backgroundColor: "#F2FEFF", borderColor: "#8AA5A8" }}
      >
        <Search className="w-5 h-5 shrink-0 mr-3" style={{ color: "#8AA5A8" }} />
        <input
          ref={inputRef}
          type="text"
          id="search"
          autoComplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          className="flex-1 min-w-0 bg-transparent text-base outline-none placeholder:text-gray-400 focus:outline-none"
          style={{ color: "#8AA5A8" }}
          value={value}
          onFocus={onFocus}
          onClick={onClick}
          onChange={(e) => {
            if (!isMobile) onChange(e.target.value);
          }}
          onKeyDown={onKeyDown}
          readOnly={isMobile}
        />

        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 rounded-full hover:bg-[#E0EFF1] text-[#8AA5A8] transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-4 mx-2" style={{ backgroundColor: "#8AA5A8" }} />
        <button
          type="button"
          onClick={onKeyboardToggle}
          className="p-1.5 rounded hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
          aria-label="Keyboard"
          style={{ color: "#8AA5A8" }}
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>

      <KeyboardURH
        isOpen={showKeyboard}
        value={isMobile ? "" : value}
        handleChange={onKeyboardChange}
        handleEnter={onKeyboardEnter}
        onClose={onKeyboardClose}
      />
    </>
  );
};
