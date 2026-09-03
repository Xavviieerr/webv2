import type { MiniFigures } from "@/features/shared/types";

export type Figure = {
  id: string;
  fullName: string;
  category: string;
  shortBio: string;
  introBio: string;
  status: string;
  nationality: string;
  ethnicity: string;
  occupation: string;
  suggestionNote: string;
  profilePhoto: string;
  otherNames: string;
  gender: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  placeOfBirth: string;
  religion: string;
  tags: string[];
  notableAchievements: string[];
  externalLinks: {
    name: string;
    url: string;
    accessDate?: string;
  }[];
  era: string;
  region: string;
  translation?: {
    language: string;
    shortBio: string;
    introBio: string;
  };
  biography: {
    title: string;
    overview: string;
    order: number;
    entries: {
      title: string;
      content: string;
      order: number;
      photos: string[];
      translations?: {
        language: string;
        title: string;
        content: string;
      }[];
    }[];
    translations?: {
      language: string;
      title: string;
      overview: string;
    }[];
  }[];
  timeline?: {
    year: string;
    title: string;
    description: string;
    order: number;
    translations: {
      language: string;
      title: string;
      description: string;
      order: number;
    }[];
  }[];
  family: {
    id: string;
    name: string;
    relationship: string;
    occupation: string;
    bio: string;
    photo: string;
    photos: string[];
    dateOfBirth: string;
    dateOfDeath?: string | null;
    marriageYear?: string | null;
    divorceYear?: string | null;
    linkedFigureId?: string | null;
  }[];
  relatedFigures?: {
    // Define fields here once the structure is known.
    [key: string]: unknown;
  }[];
};

export type FiguresResponse = {
  data: MiniFigures[];
  pagination: {
    page: any;
    totalPages: any;
  };
};
