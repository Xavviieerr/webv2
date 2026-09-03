/* eslint-disable @typescript-eslint/no-explicit-any */

/** Extract results array from API response; handles multiple response shapes. */
export function getResultsFromResponse(response: any): any[] {
  if (!response || typeof response !== "object") return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data?.results)) return data.data.results;
  }
  if (Array.isArray(response.results)) return response.results;
  return [];
}

/**
 * Transform API search response to the format expected by the word display page.
 */
export function transformSearchResponse(data: any, language: string) {
  const results = getResultsFromResponse(data);

  const records = results.map((result: any) => {
    const wordData = result.word;
    const oho = wordData.oho || [];
    const efaEng = wordData.efaEng || [];
    const efaKor = wordData.efaKor || [];

    const meanings = oho.map((ohoItem: any) => {
      const idjeList = ohoItem.idje || [];
      return {
        word: wordData.ota,
        definitions: [ohoItem.oto].filter(Boolean),
        partOfSpeech: ohoItem.ekerota || [],
        examples: idjeList.map((e: any) =>
          typeof e === "string" ? e : (e?.sentence ?? ""),
        ),
        kere: ohoItem.kere,
        fullExamples: idjeList || [],
        exampleAudioUrls: idjeList.map((e: any) => {
          if (!e || typeof e === "string") return null;
          const omra = e.omra;
          if (
            Array.isArray(omra) &&
            omra.length > 0 &&
            typeof omra[0] === "string"
          )
            return omra[0];
          if (typeof omra === "string") return omra;
          return null;
        }),
        synonyms: (ohoItem.okpo || []).filter(Boolean).map((s: any) => {
          if (typeof s === "string") {
            return { word: s };
          }
          return { word: s.ota || s.word || String(s) };
        }),
        plurals: (ohoItem.ibuebu || []).filter(Boolean),
        antonyms: (ohoItem.orhan || []).filter(Boolean),
        relatedWords: [],
        media: (ohoItem.oma || []).map((mediaItem: any) => ({
          url: mediaItem.url || "",
          type: mediaItem.type || "photo",
        })),
        dialect: ohoItem.erevwe || wordData.erevwe,
      };
    });

    const englishTranslations = efaEng.map((engItem: any) => ({
      word: engItem.otaWord,
      definitions: [engItem.details?.oto].filter(Boolean),
      partOfSpeech: engItem.details?.ekerota || [],
      examples: (engItem.details?.idje || []).map((e: any) => e.sentence),
      fullExamples: engItem.details?.idje || [],
      kere: engItem.kere,
      synonyms: (engItem.details?.okpo || []).filter(Boolean).map((s: any) => {
        if (typeof s === "string") {
          return { word: s };
        }
        return { word: s.ota || s.word || String(s) };
      }),
      plurals: (engItem.details?.ibuebu || []).filter(Boolean),
      antonyms: (engItem.details?.orhan || []).filter(Boolean),
      relatedWords: [],
      media: [],
      dialect: null,
      pronunciationAudioUrl:
        engItem.details?.omra?.length > 0 ? engItem.details.omra[0] : null,
      pronunciation:
        engItem.details?.upho || engItem.details?.uphoesio
          ? {
              ipa: engItem.details?.upho || "",
              phonetic: engItem.details?.uphoesio || "",
            }
          : undefined,
    }));

    const koreanTranslations = efaKor.map((korItem: any) => {
      // Handle null details gracefully
      const details = korItem.details || {};
      return {
        word: korItem.otaWord || "",
        definitions: details.oto ? [details.oto].filter(Boolean) : [],
        partOfSpeech: details.ekerota || [],
        examples: (details.idje || []).map((e: any) => e.sentence),
        fullExamples: details.idje || [],
        kere: korItem?.kere,
        synonyms: (details.okpo || []).filter(Boolean).map((s: any) => {
          if (typeof s === "string") {
            return { word: s };
          }
          return { word: s.ota || s.word || String(s) };
        }),
        plurals: (details.ibuebu || []).filter(Boolean),
        antonyms: (details.orhan || []).filter(Boolean),
        relatedWords: [],
        media: [],
        dialect: null,
        pronunciationAudioUrl:
          details.omra?.length > 0 ? details.omra[0] : null,
        pronunciation:
          details.upho || details.uphoesio
            ? { ipa: details.upho || "", phonetic: details.uphoesio || "" }
            : undefined,
      };
    });

    const firstOho = oho[0];
    const pronunciation = firstOho
      ? { ipa: firstOho.upho || "", phonetic: firstOho.uphoesio || "" }
      : undefined;
    const omra = firstOho?.omra;
    const pronunciationAudioUrl =
      Array.isArray(omra) && omra.length > 0
        ? typeof omra[0] === "string"
          ? omra[0]
          : null
        : null;

    return {
      id: wordData.id,
      word: wordData.ota,
      language: "urhobo",
      matchType: "exact",
      similarityScore: result.score || 100,
      meanings,
      translations: { en: englishTranslations, kor: koreanTranslations },
      pairedExamples: [],
      isFavorite: false,
      pronunciation,
      pronunciationAudioUrl: pronunciationAudioUrl ?? null,
      otaOkpopko: wordData.otaOkpopko || false,
      creationReason: wordData.creationReason || null,
    };
  });

  return {
    metadata: {
      totalRecords: data?.data?.total || results.length,
      languageMap: { urhobo: "Urhobo", en: "English", kor: "Korean" },
      query: "",
      language,
      count: results.length,
      page: 1,
      generatedAt: new Date().toISOString(),
      source: "PostgreSQL Database",
      searchOptions: {
        language,
        fuzzy: "false",
        searchMode: "standard",
        reverseSearch: false,
      },
    },
    records,
  };
}
