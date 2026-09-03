// filterSearchResults.ts
import { safeDecodeURIComponent } from "./safe-decode";

interface MatchOptions {
  normalizeDiacritics?: boolean;
}

const LANGUAGE_FIELD_MAP: Record<string, string> = {
  efaEng: "en",
  efaKor: "kor",
};

const DEFAULT_OPTS: MatchOptions = { normalizeDiacritics: true };

function normalize(str: string): string {
  return str.normalize("NFC").toLowerCase();
}

function matches(
  candidate: string,
  query: string,
  opts: MatchOptions,
): boolean {
  const c = normalize(candidate);
  const q = normalize(safeDecodeURIComponent(query));

  return c === q || c.startsWith(q);
}

type MatchResult =
  | { type: "all" } // headword itself matched — every sense survives, no otaWord
  | { type: "partial"; matches: Map<number, string> }; // kere -> matched otaWord

/**
 * Determines which senses survive the query, and if matched via translation,
 * which translated word (otaWord) triggered the match for that sense.
 */
function getMatchingKeres(
  word: WordRecord,
  query: string,
  opts: MatchOptions = DEFAULT_OPTS,
): MatchResult {
  if (matches(word.ota, query, opts)) {
    return { type: "all" };
  }

  const matchedKeres = new Map<number, string>(); // kere -> otaWord

  for (const field of Object.keys(LANGUAGE_FIELD_MAP)) {
    const entries: TranslationEntry[] | undefined = word[field];
    if (!entries) continue;

    for (const entry of entries) {
      if (matches(entry.otaWord, query, opts)) {
        // first match wins per kere; if you want to keep ALL matched
        // translations per kere instead, see note below
        if (!matchedKeres.has(entry.kere)) {
          matchedKeres.set(entry.kere, entry.otaWord);
        }
      }
    }
  }

  return { type: "partial", matches: matchedKeres };
}

interface PrunedWord {
  word: WordRecord;
  matchedOtaWord?: string; // single word-level match now, not per-kere
}

function pruneWordToMatchingSenses(
  word: WordRecord,
  query: string,
  opts?: MatchOptions,
): PrunedWord | null {
  const result = getMatchingKeres(word, query, opts);

  if (result.type === "all") {
    return { word }; // headword matched — no otaWord to surface
  }

  const { matches: matchedKeres } = result;
  if (matchedKeres.size === 0) return null;

  const pruned: WordRecord = {
    ...word,
    oho: word.oho.filter((sense) => matchedKeres.has(sense.kere)),
  };

  for (const field of Object.keys(LANGUAGE_FIELD_MAP)) {
    const entries: TranslationEntry[] | undefined = word[field];
    if (!entries) continue;
    pruned[field] = entries.filter((entry) => matchedKeres.has(entry.kere));
  }

  if (pruned.oho.length === 0) return null;

  // take the first matched translation word, regardless of which kere it came from
  const matchedOtaWord = matchedKeres.values().next().value;

  return { word: pruned, matchedOtaWord };
}

export function filterSearchResultsByQuery(
  results: SearchResult[],
  query: string,
  opts?: MatchOptions,
): Array<SearchResult & { matchedOtaWord?: string }> {
  const out: Array<SearchResult & { matchedOtaWord?: string }> = [];

  for (const { word, score } of results) {
    const prunedResult = pruneWordToMatchingSenses(word, query, opts);
    if (prunedResult) {
      out.push({
        word: prunedResult.word,
        score,
        matchedOtaWord: prunedResult.matchedOtaWord,
      });
    }
  }

  return out;
}

function buildTranslationsForKere(
  word: WordRecord,
  kere: number,
): TranslationPacket["translations"] {
  const translations: TranslationPacket["translations"] = {};

  for (const [field, langCode] of Object.entries(LANGUAGE_FIELD_MAP)) {
    const entries: TranslationEntry[] | undefined = word[field];
    if (!entries) continue;

    // there could in theory be more than one entry per kere (rare),
    // but we take the first match — adjust to .filter() if you need all
    const match = entries.find((entry) => entry.kere === kere);
    if (!match) continue;

    translations[langCode] = {
      word: match.otaWord,
      definition: match.details.oto,
      partOfSpeech: match.details.ekerota,
      audio: match.details.omra?.[0],
      pronunciation: match.details.upho,
      ipa: match.details.uphoesio,
      pluralForms: match.details.ibuebu ?? [],
      synonyms: match.details.okpo ? match.details.okpo.map((s) => s.ota) : [],
      antonyms: match.details.orhan ?? [],
      relatedWords: match.details.ekaeruo ?? [],
      examples: match.details.idje ?? [],
    };
  }

  return translations;
}

function formatWord(word: WordRecord): SensePacket {
  const senses: TranslationPacket[] = word.oho
    .map((sense) => ({
      word: word.ota,
      kere: sense.kere,
      definition: sense.oto,
      partOfSpeech: sense.ekerota,
      pronunciation: sense.upho,
      ipa: sense.uphoesio,
      examples: sense.idje ?? [],
      pluralForms: sense.ibuebu ?? [],
      synonyms: sense.okpo ? sense.okpo.map((s) => s.ota) : [],
      antonyms: sense.orhan ?? [],
      relatedWords: sense.ekaeruo ?? [],
      image: sense.oma?.[0]?.url,
      audio: sense.omra?.[0],
      translations: buildTranslationsForKere(word, sense.kere),
    }))
    .sort((a, b) => a.kere - b.kere);

  return {
    wordId: word.id,
    ota: word.ota,
    dialect: word.erevwe,
    score: 0,
    senses,
  };
}

/**
 * Removes duplicate word entries by `id`, keeping the first occurrence
 * (assumes results are already ordered by relevance/score).
 */
function dedupeResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  const out: SearchResult[] = [];

  for (const result of results) {
    const key = result.word.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(result);
  }

  return out;
}

export function formatSearchResults(
  results: SearchResult[],
  query: string,
): SensePacket[] {
  const filtered = filterSearchResultsByQuery(results, query);

  const deduped = dedupeResults(filtered);

  // const sortStart = performance.now();

  const sorted = [...deduped].sort((a, b) => {
    const aKey = a.matchedOtaWord ?? a.word.ota;
    const bKey = b.matchedOtaWord ?? b.word.ota;
    return aKey.localeCompare(bKey);
  });

  // const sortEnd = performance.now();
  // console.log(
  //   `Sorting took ${(sortEnd - sortStart).toFixed(3)}ms for ${deduped.length} items`,
  // );

  return sorted.map(({ word, score, matchedOtaWord }) => ({
    ...formatWord(word),
    score,
    otaWord: matchedOtaWord,
  }));
}

export function formatExactSearchResults(
  results: SearchResult[],
  // query: string,
): SensePacket[] {
  // const filtered = filterSearchResultsByQuery(results, query);
  // const deduped = dedupeResults(filtered);

  return results.map(({ word, score }) => ({
    ...formatWord(word),
    score,
    // otaWord: matchedOtaWord,
  }));
}
