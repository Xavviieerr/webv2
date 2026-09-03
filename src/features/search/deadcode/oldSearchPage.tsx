"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { useLazySearchWordsQuery } from "@/slice/wordEndpoints";
import { setSavedQuery, setSearchQuery } from "@/slice/wordSlice";
import { WordRecord } from "@/slice/wordSlice";
import { transformSearchResponse } from "@/utils/transformSearchResponse";
import Link from "next/link";
import { SearchResults } from "./searchResults";
import { GenericSearchComponent } from "./genericSearchComponent";
import { motion } from "framer-motion";

interface OldSearchPageProps {
  initialQuery?: string;
}

function SearchPage({ initialQuery = "" }: OldSearchPageProps) {
  const [fullSearchResults, setFullSearchResults] = useState<WordRecord[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(!!initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const [fetchSearchWords] = useLazySearchWordsQuery();
  const dispatch = useAppDispatch();
  const { searchQuery, savedQuery } = useAppSelector((state) => state.word);
  const router = useRouter();

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setIsSearching(true);
      setHasSearched(true);
      dispatch(setSearchQuery(query.trim()));
      // Persist search term in the URL so refresh keeps results.
      // Use a relative push so it works regardless of the current path prefix.
      router.push(`?q=${encodeURIComponent(query.trim())}`);
      dispatch(setSavedQuery(query.trim()));

      try {
        const response = await fetchSearchWords({
          q: query.trim(),
          mode: "all",
          lang: "any",
          limit: 50,
          // reverse: true,
        }).unwrap();
        const transformed = transformSearchResponse(response, "urhobo");
        setFullSearchResults(transformed.records || []);
      } catch (err) {
        console.error("Search error:", err);
        setFullSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch, fetchSearchWords, router],
  );

  // On initial load, if there's a query in the URL, run the search
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const showResults = hasSearched && initialQuery;

  return (
    <div
      className="flex flex-col relative min-h-[calc(100vh-80px)] overflow-y-hidden"
      style={{ backgroundColor: "#F2FEFF" }}
    >
      <div className="relative z-10">
        {showResults ? (
          <SearchResults
            results={fullSearchResults}
            searchQuery={searchQuery}
            savedQuery={savedQuery}
            onSearch={performSearch}
            isSearching={isSearching}
          />
        ) : (
          <div className="flex flex-col items-center  min-h-[calc(100vh-80px)] mx-auto px-4 sm:px-6">
            <motion.div
              className="flex justify-center items-center mt-48 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/">
                <Image
                  src="/guono-home-search-logo.svg"
                  alt="Guọnọ logo"
                  width={100}
                  height={25}
                  aria-label="Guọnọ logo"
                  className="w-50 sm:w-60 h-auto max-w-70"
                />
              </Link>
            </motion.div>

            <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-4xl mx-auto px-2 sm:px-4">
              <GenericSearchComponent
                initialQuery={initialQuery}
                onSearchOnly={performSearch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
