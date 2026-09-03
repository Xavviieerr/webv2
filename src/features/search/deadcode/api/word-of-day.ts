import { apiFetch } from "../../shared/api-fetch";

interface WordOfDayApiWord {
  id: string;
  ota: string;
  erevwe: string;
  status: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  oho: Array<{
    id: string;
    kere: number;
    erevwe: string;
    oto: string;
    otoOmra: string;
    upho: string;
    uphoesio: string;
    ekerota: string[];
    idje: any[];
  }>;
}

type WordOfDayResponse = {
  wordOfTheDay: WordOfDayApiWord;
};

export async function fetchWordOfTheDay({
  token,
}: {
  token: string;
}): Promise<WordOfDayApiWord | undefined> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/word/daily-word`;
    const data = await apiFetch<WordOfDayResponse>(url, { token });
    return data.wordOfTheDay;
  } catch {
    return undefined;
  }
}
