// Preserved snapshot of src/slice/wordSlice.ts before Phase D cleanup.
// wordOfDay/setWordOfDay were confirmed dead (written, never read) and removed
// from the live slice. This copy is kept for history only and is NOT imported.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Translation {
  word: string;
  definitions: string[];
  partOfSpeech: string[];
  examples: string[];
  fullExamples: { audioUrl: string | null; sentence: string | null }[];
  kere: number;
  synonyms: any[];
  plurals?: string[];
  antonyms?: string[];
  relatedWords: string[];
  media: {
    url: string;
    type: string;
  }[];
  dialect: string | null;
  /** IPA/phonetic for this translation (e.g. from efaEng/efaKor details) */
  pronunciation?: { ipa?: string; phonetic?: string };
  pronunciationAudioUrl?: string | null;
}

export interface Meaning {
  word: string;
  definitions: string[];
  partOfSpeech: string[];
  examples: string[];
  fullExamples: { audioUrl: string | null; sentence: string | null }[];
  /** Per-example audio URLs from idje[].omra; same length as examples; null = no audio for that example */
  exampleAudioUrls?: (string | null)[];
  kere: number;
  synonyms: any[];
  plurals?: string[];
  antonyms?: string[];
  relatedWords: string[];
  media: {
    url: string;
    type: string;
  }[];
  dialect: string;
}

export interface WordRecord {
  id: number;
  word: string;
  language: string;
  matchType: string;
  similarityScore: number;
  meanings: Meaning[];
  translations: {
    en?: Translation[];
    urh?: Translation[];
    kor?: Translation[];
  };
  pairedExamples: any[];
  isFavorite: boolean;
  pronunciation?: {
    ipa?: string; // upho
    uphoesio?: string; // uphoesio
    phonetic?: string; // phonetic
  };
  /** First pronunciation audio URL from word.oho[0].omra (voice sound) */
  pronunciationAudioUrl?: string | null;
  otaOkpopko?: boolean; // indicates if word is new
  creationReason?: string | null; // reason for word creation
}

interface ApiResponse {
  metadata: {
    totalRecords: number;
    languageMap: Record<string, string>;
    query: string;
    language: string;
    count: number;
    page: number;
    generatedAt: string;
    source: string;
    isPartialSearch?: boolean;
    searchOptions: {
      language: string;
      fuzzy: string;
      searchMode: string;
      reverseSearch: boolean;
    };
  };
  records: WordRecord[];
}

interface WordState {
  wordOfDay: Word | null;
  searchResults: SearchResult[];
  searchQuery: string;
  savedQuery: string;
  detailedWord: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface Word {
  word: string;
  meaning: string;
  phonetic?: string;
  ipa?: string;
  photo?: {
    url: string;
    type: "photo" | string;
  };
}

interface SearchResult {
  id: number;
  word: string;
  eyuo?: string;
  eyuoEng?: string[];
  eyuoKor?: string;
  definitions?: {
    partOfSpeech: string;
    definition: string;
    exampleInNative: string;
    exampleEnglish: string;
    exampleNative: string;
  }[];
  suggestedWords?: string[];
  moreExamples?: {
    english: string;
    native: string;
  }[];
}

const initialState: WordState = {
  wordOfDay: null,
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
    setWordOfDay: (state, action: PayloadAction<Word>) => {
      state.wordOfDay = action.payload;
      state.error = null;
    },
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
  setWordOfDay,
  setSearchResults,
  setSearchQuery,
  setSavedQuery,
  setLoading,
  setError,
  clearSearch,
  setDetailedWord,
} = wordSlice.actions;

export default wordSlice.reducer;
