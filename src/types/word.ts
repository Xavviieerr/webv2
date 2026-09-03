/**
 * Shared word-domain types for the Dictionary and Search features.
 * Canonical definitions live here (not in a Redux slice) so that no feature
 * depends on another feature's internals.
 */

export interface Translation {
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
  uuid?: string;
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

export interface ApiResponse {
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

export interface SearchResult {
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
