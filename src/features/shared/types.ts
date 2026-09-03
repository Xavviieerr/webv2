export type Results = {
  words: SensePacket[];
  names: NameRecord["items"];
  figures: MiniFigures[];
};

export type Figure = {
  personal: {
    "Full Name": string;
    "Other Names": string;
    "Date Of Birth": string;
    "Place Of Birth": string;
    "Date Of Death": string | null;
    "Place Of Death": string | null;
    "Cause Of Death": string | null;
    Gender: string;
    Category: string;
    father: string;
    mother: string;
    grandparents: string[];
    siblings: string[];
    spouses: string[];
    children: string[];
    extendedFamily: string[];
  };
  gallery: {
    image: string;
    caption: string;
  }[];
  summary: string;
  biography: {
    title: string;
    body: string;
  }[];
  sources: {
    id: string;
    type: "article" | "book" | "interview" | "oral history" | "website";

    //articles & books
    title: string;
    author?: string;
    publishedBy?: string;
    publishedOn?: string;

    //for websites
    url?: string;
    accessDate?: string;

    //for interviews & oral history
    speaker?: string;
    date?: string;

    context: string;
  }[];
};

export type MiniFigures = {
  id: string;
  fullName: string;
  slug: string;
  profilePhoto: string | null;
  shortBio: string;
  introBio: string;
  dateOfBirth: string | null;
  dateOfDeath: string | null;
  placeOfBirth: string | null;
  nationality: string;
  ethnicity: string;
  religion: string | null;
  occupation: string;
  category: string;
  era: string | null;
  region: string | null;
  status: string;
  submissionType: string;
  createdBy: any | null;
  createdAt: string;
};

export type SingleName = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  culturalSignificance: string;
  gender: string;
  syllableCount: number;
  source: string;
  abbreviations: never[];
  nameOriginStory: string;
  regionOfUse: string;
  alternativeSpellings: never[];
  relatedNames: never[];
  notableBearers: never[];
  nicknames: never[];
  nameComposition: never[];
  nameType: string;
  popularityRank: number;
  historicalUsage: string;
  modernUsage: string;
  astrologicalAssociations: never[];
  commonMisspellings: never[];
  linguisticNotes: string;
  culturalNotes: string;
  otherNotes: string;
  status: string;
  createdById: string;
  rejectionReason: null;
  rejectedBy: null;
  approvedBy: null;
  translations: {
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
  }[];
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type Lang = "urhobo" | "en" | "kor";

export type NameRecord = {
  items: {
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
    createdBy: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
    };
  }[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
