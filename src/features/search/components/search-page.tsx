import Image from "next/image";
import React from "react";
import SearchBar from "./search-bar";
import WordOfTheDay from "./word-of-the-day";
import DailyWordWrapper from "./daily-word-wrapper";
import { LocaleWrapper } from "@/features/shared";

const SearchPage = async () => {
  return (
    <div className="flex flex-col items-center mt-[15svh] md:mt-[20vh] gap-2 w-full px-3">
      <Image
        src="/guono-logo.svg"
        alt="Guọnọ logo"
        width={200}
        height={96}
        className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto "
        priority
      />

      <h1 className="md:text-2xl lg:font-bold md:font-medium text-primary md:mb-5 mb-1 italic text-primary/80">
        <span className="mr-1 ">
          <LocaleWrapper item="everything" />
        </span>{" "}
        <LocaleWrapper item="oneSearch" />
      </h1>

      <SearchBar />

      <DailyWordWrapper>
        <WordOfTheDay />
      </DailyWordWrapper>
    </div>
  );
};

export default SearchPage;
