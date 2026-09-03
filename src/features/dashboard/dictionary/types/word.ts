/** Domain-level word types for the Dictionary feature. */

export type WordWithPronunciation = {
  oho?: Array<{ upho?: string; uphoesio?: string }>;
};

/** Word returned by the words-to-review-and-ratings endpoint. */
export interface NewlyAddedWord extends WordWithPronunciation {
  id: string;
  ota: string;
  status: string;
  createdAt: string;
}
