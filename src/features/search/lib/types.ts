// types.ts

interface ExampleSentence {
  sentence: string;
  audioUrl?: string;
}

interface ImageRef {
  url: string;
  type: string;
}

interface Sense {
  id: string;
  otaId: string;
  kere: number;
  erevwe?: string; // dialect, only present on the source-language sense
  ekerota: string[]; // part of speech
  oto: string; // definition
  otoOmra?: string | null;
  idje: ExampleSentence[]; // example sentences
  upho: string; // syllabification
  uphoesio?: string; // IPA / pronunciation
  okpo: { ota: string; egba: string }[];
  ibuebu: string[]; // plural forms
  orhan: string[];
  ekaeruo: string[];
  oma: ImageRef[] | null; // images
  omra: string[] | null; // audio
  odeUfue: string[]; // scientific/classifier tags
}

interface TranslationEntry<T extends Sense = Sense> {
  id: string;
  otaId: string;
  kere: number;
  otaWord: string;
  details: T;
  isApproved: boolean | null;
  isRejected: boolean | null;
  moderatorComments: string | null;
}

interface WordRecord {
  id: string;
  ota: string; // headword
  erevwe: string; // dialect
  status: string;
  oho: Sense[];
  efaEng: TranslationEntry[];
  efaKor: TranslationEntry[];
  [key: string]: any;
}

interface SearchResult {
  word: WordRecord;
  score: number;
  matchedOtaWord?: string;
}

// The shape we want to produce: one packet per sense
interface TranslationPacket {
  word: string; // ota
  kere: number;
  definition: string;
  partOfSpeech: string[];
  pronunciation: string;
  ipa?: string;
  examples: ExampleSentence[];
  pluralForms: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
  image?: string;
  audio?: string;
  translations: {
    [lang: string]: {
      word: string;
      definition: string;
      partOfSpeech: string[];
      pronunciation?: string;
      ipa?: string;
      audio?: string;
      pluralForms: string[];
      synonyms: string[];
      antonyms: string[];
      relatedWords: string[];
      examples: ExampleSentence[];
    };
  };
}

interface SensePacket {
  wordId: string;
  ota: string;
  otaWord?: string;
  dialect: string;
  score: number;
  senses: TranslationPacket[];
}
