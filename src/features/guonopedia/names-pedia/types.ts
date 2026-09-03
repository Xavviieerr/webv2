export type NameTranslationItem = {
  id: string;
  nameId: string;
  targetLanguage: string;
  translatedMeaning: string;
  equivalentName: string;
  priority: number;
  isPrimary: boolean;
  notes: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
};

export type NameItem = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  culturalSignificance: string;
  gender: string;
  source: string | null;
  nameType: string;
  status: string;
  createdBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  translations: NameTranslationItem[];
  createdAt: string;
  updatedAt: string;
};

export type NamesResponse = {
  msg: any;
  data: {
    id: string;
    name: string;
    meaning: string;
    culturalSignificance: string;
    gender: string;
    source: string;
    nameType: string;
    status: string;
    translations: {
      translatedMeaning: string;
      equivalentName: string;
      notes: string;
    }[];
  }[];
  pagination: {
    page: any;
    totalPages: any;
  };
};
