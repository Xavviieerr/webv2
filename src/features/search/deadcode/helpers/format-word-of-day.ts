interface WordDetail {
  id: string;
  kere: number;
  erevwe: string;
  oto: string;
  otoOmra: string;
  upho: string;
  uphoesio: string;
  ekerota: string[];
  idje: any[];
}

interface WordOfTheDay {
  id: string;
  ota: string;
  erevwe: string;
  status: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  oho: WordDetail[];
}

interface FormattedWord {
  id: string;
  word: string;
  dialect: string;
  status: string;
  pronunciation: string;
  pos: string;
  ipa: string;
  definition: string;
  examples: any[];
  updatedAt: string;
}

export function formatWordOfTheDay(data: WordOfTheDay): FormattedWord {
  const detail = data.oho?.[0];

  return {
    id: data.id,
    word: data.ota,
    dialect: data.erevwe,
    status: data.status,
    pos: detail?.ekerota[0] ?? "",
    pronunciation: detail?.upho ?? "",
    ipa: detail?.uphoesio ?? "",
    definition: detail?.oto ?? "",
    examples:
      detail?.idje?.map((item: { sentence: string }) => item.sentence) ?? [],
    updatedAt: data.updatedAt,
  };
}
