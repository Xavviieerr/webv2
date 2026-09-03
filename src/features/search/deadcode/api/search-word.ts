import { apiFetch } from "../../shared/api-fetch";

type SearchResult = {
  word: {
    id: string;
    ota: string;
    erevwe: string;
    status: string;
    oho: Sense[];
    efaEng: TranslationEntry[];
    efaKor: TranslationEntry[];
    [key: string]: any;
  };
  score: number;
};

export async function searchWord({
  token,
  searchTerm,
  lang = "any",
  mode = "partial",
  limit = "10",
  reverse = false,
  signal,
}: {
  token: string;
  searchTerm: string;
  lang?: "any" | "urhobo" | "english" | "korean";
  mode?: "exact" | "partial";
  limit?: string;
  reverse?: boolean;
  signal?: AbortSignal;
}): Promise<SearchResult[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&lang=${lang}&mode=${mode}${reverse ? `&reverse=true` : ""}`;

  const data = await apiFetch<{ results: SearchResult[] }>(url, {
    token,
    signal,
  });

  return data.results;
}
