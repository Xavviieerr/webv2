export interface ButtonProps {
  buttonLabel: string;
  buttonMargin?: string;
  buttonSize?: string;
  buttonDisplay: string;
}

/**
 * @deprecated Use `AuthUser` from `@/features/auth/types` directly.
 * This re-export exists for backward compatibility only.
 */
export type { AuthUser as User } from "@/features/auth/types";

export const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Guọnọpedia", href: "/Guọnọpedia" },
  { label: "Donate", href: "/donate" },
];

export const profileLinks = [
  { label: "Personal Details", modal: "personalDetails", t: "personalDetails" },
  { label: "Username", modal: "username", t: "username" },
  { label: "Password", modal: "password", t: "passWord" },
  // { label: "Preferred Language", modal: "language" },
  // { label: "History", modal: "history" },
  // { label: "Saved", modal: "saved" },
  { label: "Delete Account", modal: "delete", t: "deleteAccount" },
];

export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  image: string
  featured: boolean
  author: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

// Word of Day types
export interface WordOfDayOho {
  id: string;
  otaId: string;
  kere: number;
  erevwe: string;
  ekerota: string[];
  oto: string;  // meaning/definition
  otoOmra: string | null;
  idje: string | null;
  upho: string;
  okpo: string | null;
  ibuebu: string | null;
  orhan: string | null;
  ekaeruo: string | null;
  oma: string | null;
  omra: string[];
  odeUfue: string | null;
  uphoesio: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface WordOfDayData {
  id: string;
  ota: string;  // the word itself
  erevwe: string;
  status: string;
  creationReason: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  rejectedBy: string | null;
  reviewedBy: string;
  otaOkpopko: boolean;
  oka: number;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  directQueryCount: number;
  lastAccessed: string | null;
  oho: WordOfDayOho[];
}

export interface WordOfDayMetadata {
  generatedAt: string;
  source: string;
}

export interface WordOfDayResponse {
  data: {
    wordOfTheDay: WordOfDayData;
    metadata: WordOfDayMetadata;
  };
  message: string;
}

// Word Review types
export interface WordReviewOho {
  id: string;
  otaId: string;
  kere: number;
  erevwe: string;
  ekerota: string[];
  oto: string;
  otoOmra: string | null;
  idje: { sentence: string }[] | null;
  upho: string;
  okpo: string | null;
  ibuebu: string[] | null;
  orhan: string | null;
  ekaeruo: string | null;
  oma: string | null;
  omra: string[] | null;
  odeUfue: string | null;
  uphoesio: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface WordToReview {
  id: string;
  ota: string;
  erevwe: string;
  status: string;
  creationReason: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  rejectedBy: string | null;
  reviewedBy: string | null;
  otaOkpopko: boolean;
  oka: number;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  directQueryCount: number;
  lastAccessed: string | null;
  oho: WordReviewOho[];
}

export interface EfaDetails {
  id: string;
  ekerota: string[];
  oto: string;
  otoOmra: string | null;
  idje: { sentence: string }[] | null;
  okpo: string | null;
  ibuebu: string[] | null;
  orhan: string | null;
  ekaeruo: string | null;
  upho: string;
  oma: string | null;
  omra: string[] | null;
  odeUfue: string | null;
  uphoesio: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface EfaEng {
  id: string;
  otaId: string;
  kere: number;
  otaWord: string;
  details: EfaDetails;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface EfaKor {
  id: string;
  otaId: string;
  kere: number;
  otaWord: string;
  details: EfaDetails;
  createdAt: string;
  updatedAt: string;
  rowVersion: number;
}

export interface WordCreator {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface WordFullDetails extends WordToReview {
  createdBy: WordCreator;
  efaEng: EfaEng[];
  efaKor: EfaKor[];
  wordRatings: unknown[];
  totalRatings: number;
  totalReviews: number;
  averageRating: number;
}

export interface WordReviewPagination {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
