"use client";

import React, {useMemo} from "react";
import {useQueryCtx} from "../lib/context";
import SearchBar from "./search-bar";
import {SearchSkeleton} from "./search-skeleton";
import {SearchEmpty} from "./search-empty";
import {SearchError} from "./search-error";
import {WordResultItem, FigureResultItem, NameResultItem, PlaceResultItem, ResultsSidebar} from "./results";

const SearchResults = ({q}: {q: string}) => {
  const {
    results: {words, figures, names, places},
    isLoading,
    error,
    searchTerm,
  } = useQueryCtx();

  const showSideBar = words.length > 3 || figures.length > 2 || names.length > 2 || places.length > 2;

  const linkFigures = useMemo(() => {
    if (words.length > 3 || figures.length > 2) return figures.slice(2);
    return figures;
  }, [words.length, figures]);

  const linkNames = useMemo(() => {
    if (words.length > 3 || figures.length > 2 || names.length > 2) return names.slice(2);
    return names;
  }, [words.length, figures.length, names]);

  const linkPlaces = useMemo(() => {
    if (words.length > 3 || figures.length > 2 || names.length > 2 || places.length > 2)
      return places.slice(2);
    return places;
  }, [words.length, figures.length, names.length, places.length]);

  const hasResults = words.length > 0 || figures.length > 0 || names.length > 0 || places.length > 0;

  return (
    <div className="flex flex-col items-center w-full h-full font-plus-sans pb-20 px-2">
      <SearchBar defaultValue={q} forNav />

      <div className="flex justify-center w-full gap-8 max-w-7xl mx-auto md:mt-14 mt-7 px-4">
        <div className="flex flex-col max-w-2xl w-full">
          {isLoading && <SearchSkeleton />}

          {!isLoading && error && <SearchError error={error} />}

          {!isLoading && !error && !hasResults && <SearchEmpty query={searchTerm} />}

          {!isLoading && !error && hasResults && (
            <div className="flex flex-col gap-4">
              {words.map((word) => (
                <WordResultItem key={word.ota} word={word} />
              ))}
              {linkFigures.map((figure) => (
                <FigureResultItem key={figure.id} figure={figure} />
              ))}
              {linkNames.map((name) => (
                <NameResultItem key={name.id} name={name} />
              ))}
              {linkPlaces.map((place) => (
                <PlaceResultItem key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>

        {showSideBar && !isLoading && !error && hasResults && (
          <ResultsSidebar figures={figures} names={names} places={places} />
        )}
      </div>
    </div>
  );
};

export default SearchResults;
