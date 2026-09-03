import { WordRecord } from "@/types/word";

/**
 * Transform word data from the /word endpoint to the WordRecord display
 * format. Kept separate from the shared search-response transformer because
 * the /word endpoint payload differs (no kere/fullExamples/exampleAudioUrls).
 */
export function transformWordToRecord(wordData: any): WordRecord {
  const oho = wordData.oho || [];
  const efaEng = wordData.efaEng || [];
  const efaKor = wordData.efaKor || [];

  const meanings = oho.map((ohoItem: any) => ({
    word: wordData.ota,
    definitions: [ohoItem.oto].filter(Boolean),
    partOfSpeech: ohoItem.ekerota || [],
    examples: (ohoItem.idje || []).map((e: any) => e.sentence),
    synonyms: (ohoItem.okpo || [])
      .filter(Boolean)
      .map((s: string) => ({ word: s })),
    plurals: (ohoItem.ibuebu || []).filter(Boolean),
    antonyms: (ohoItem.orhan || []).filter(Boolean),
    relatedWords: [],
    media: (ohoItem.oma || []).map((mediaItem: any) => ({
      url: mediaItem.url || "",
      type: mediaItem.type || "photo",
    })),
    dialect: ohoItem.erevwe || wordData.erevwe,
  }));

  const englishTranslations = efaEng.map((engItem: any) => ({
    word: engItem.otaWord,
    definitions: [engItem.details?.oto].filter(Boolean),
    partOfSpeech: engItem.details?.ekerota || [],
    examples: (engItem.details?.idje || []).map((e: any) => e.sentence),
    synonyms: (engItem.details?.okpo || [])
      .filter(Boolean)
      .map((s: string) => ({ word: s })),
    plurals: (engItem.details?.ibuebu || []).filter(Boolean),
    antonyms: (engItem.details?.orhan || []).filter(Boolean),
    relatedWords: [],
    media: [],
    dialect: null,
  }));

  const koreanTranslations = efaKor.map((korItem: any) => ({
    word: korItem.otaWord,
    definitions: [korItem.details?.oto].filter(Boolean),
    partOfSpeech: korItem.details?.ekerota || [],
    examples: (korItem.details?.idje || []).map((e: any) => e.sentence),
    synonyms: (korItem.details?.okpo || [])
      .filter(Boolean)
      .map((s: string) => ({ word: s })),
    plurals: (korItem.details?.ibuebu || []).filter(Boolean),
    antonyms: (korItem.details?.orhan || []).filter(Boolean),
    relatedWords: [],
    media: [],
    dialect: null,
  }));

  const firstOho = oho[0];
  const pronunciation = firstOho
    ? { ipa: firstOho.upho || "", phonetic: firstOho.uphoesio || "" }
    : undefined;

  return {
    id: wordData.id,
    word: wordData.ota,
    language: "urhobo",
    matchType: "exact",
    similarityScore: 100,
    meanings,
    translations: { en: englishTranslations, kor: koreanTranslations },
    pairedExamples: [],
    isFavorite: false,
    pronunciation,
    otaOkpopko: wordData.otaOkpopko || false,
    creationReason: wordData.creationReason || null,
  };
}
