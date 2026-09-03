import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Translation,
  Meaning,
  WordRecord,
  ApiResponse,
  SearchResult,
} from "@/types/word";

export type {
  Translation,
  Meaning,
  WordRecord,
  ApiResponse,
  SearchResult,
} from "@/types/word";

interface WordState {
  searchResults: SearchResult[];
  searchQuery: string;
  savedQuery: string;
  detailedWord: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WordState = {
  searchResults: [],
  searchQuery: "",
  savedQuery: "",
  detailedWord: null,
  isLoading: false,
  error: null,
};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      // Remove duplicates based on word property
      const uniqueResults = action.payload.filter(
        (word, index, self) =>
          index === self.findIndex((w) => w.word === word.word),
      );
      state.searchResults = uniqueResults;
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSavedQuery: (state, action: PayloadAction<string>) => {
      state.savedQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = "";
      state.error = null;
    },
    setDetailedWord: (state, action: PayloadAction<ApiResponse | null>) => {
      state.detailedWord = action.payload;
    },
  },
});

export const {
  setSearchResults,
  setSearchQuery,
  setSavedQuery,
  setLoading,
  setError,
  clearSearch,
  setDetailedWord,
} = wordSlice.actions;

export default wordSlice.reducer;
