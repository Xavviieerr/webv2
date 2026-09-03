"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import ComingSoonModal from "@/components/ComingSoonModal";
import MobileSearchDrawer from "@/components/MobileSearchDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionarySearch } from "../hooks/useDictionarySearch";
import { SearchInput } from "./SearchInput";
import { SearchSuggestionsList } from "./SearchSuggestionsList";
import { SearchHistoryList } from "./SearchHistoryList";

interface GenericSearchComponentProps {
  /** When set, search is delegated to parent (no internal fetch); used when embedded in results page. */
  onSearchOnly?: (query: string) => void;
}

export const GenericSearchComponent = ({
  onSearchOnly,
}: GenericSearchComponentProps = {}) => {
  const { t } = useTranslation("common");
  const search = useDictionarySearch({ onSearchOnly });

  return (
    <div>
      <motion.div
        className="w-full max-w-full min-w-0 lg:mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative flex flex-col gap-3 sm:gap-4 w-full">
          {/* Pill-shaped search input + suggestions */}
          <div className="relative w-full" ref={search.searchContainerRef}>
            <SearchInput
              inputRef={search.inputRef}
              isMobile={search.isMobile}
              value={search.search}
              placeholder={t("searchGuono")}
              showClear={!!search.searchQuery && !search.isMobile}
              showKeyboard={search.showKeyboard}
              onChange={search.setSearch}
              onFocus={search.handleFocus}
              onClick={search.handleMobileInputClick}
              onKeyDown={search.handleKeyDown}
              onClear={search.handleClearSearch}
              onKeyboardToggle={search.handleKeyboardToggle}
              onKeyboardChange={search.setSearch}
              onKeyboardEnter={(value) => {
                if (value !== "") {
                  search.performSearch(value);
                }
              }}
              onKeyboardClose={() => search.setShowKeyboard(false)}
            />
          </div>

          {/* Autocomplete suggestions dropdown (only after user has focused input) */}
          {search.dropDownType() == "suggestions" && (
            <SearchSuggestionsList
              loading={search.suggestionsLoading}
              items={search.searchSuggestions}
              activeIndex={search.activeIndex}
              loadingLabel={t("loading")}
              emptyLabel={t("noSuggestions")}
              itemRefs={search.itemRefs}
              onActiveIndexChange={search.setActiveIndex}
              onPick={search.onSelect}
            />
          )}

          {/* Search History - Desktop (floating so it doesn't push content down) */}
          {search.dropDownType() == "history" && (
            <SearchHistoryList
              terms={search.searchHistory}
              activeIndex={search.activeIndex}
              containerRef={search.historyContainerRef}
              itemRefs={search.itemRefs}
              onActiveIndexChange={search.setActiveIndex}
              onPick={search.onSelect}
              onRemove={(term, e) => {
                e.stopPropagation();
                search.removeFromHistory(term);
              }}
              onClearAll={() => search.clearHistory()}
            />
          )}
        </div>
        {search.error && (
          <div className="text-red-500 text-sm mt-2 text-center">
            {search.error}
          </div>
        )}
      </motion.div>

      {/* Mobile Search Drawer */}
      <AnimatePresence>
        {search.showMobileDrawer && (
          <MobileSearchDrawer
            isOpen={search.showMobileDrawer}
            onClose={() => search.setShowMobileDrawer(false)}
            onPerformSearch={search.performSearch}
            showKeyboard={search.showMobileKeyboard}
            setShowKeyboard={search.setShowMobileKeyboard}
          />
        )}
      </AnimatePresence>

      {search.showComingSoonModal && (
        <ComingSoonModal closeModal={search.closeComingSoon} />
      )}
    </div>
  );
};
