import type {
  NewlyAddedWord,
  WordWithPronunciation,
} from "../types/word";

export type { NewlyAddedWord, WordWithPronunciation };

interface WordsToReviewResponse {
  message: string;
  data: {
    data: NewlyAddedWord[];
  };
}

/**
 * Feature-owned API access for GET /word/to-review-and-ratings.
 * Throws on non-OK responses; callers decide how to surface failures.
 */
export async function fetchWordsToReview(
  accessToken: string,
): Promise<NewlyAddedWord[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/word/to-review-and-ratings`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch newly coined words");
  }
  const response: WordsToReviewResponse = await res.json();
  return response?.data?.data ?? [];
}
