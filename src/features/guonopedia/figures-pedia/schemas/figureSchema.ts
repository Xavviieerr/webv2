import { z } from "zod";

const OCCUPATION_VALUES = [
  "ọseghe",
  "ọdjonẹ",
  "ọsoine",
  "ọboine",
  "ọyona",
  "activist",
  "ọchueki",
  "academia",
  "religious",
  "military",
  "ovie iku",
  "ovie",
  "ọfa",
] as const;

export const suggestFigureSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(200, "Full name must be at most 200 characters"),
  occupation: z.enum(OCCUPATION_VALUES, {
    required_error: "Occupation is required",
    invalid_type_error: "Please select a valid occupation",
  }),
  shortBio: z
    .string()
    .min(10, "Short bio must be at least 10 characters")
    .max(200, "Short bio must be at most 200 characters"),
  introBio: z
    .string()
    .min(20, "Intro bio must be at least 20 characters")
    .max(1000, "Intro bio must be at most 1000 characters"),
  nationality: z.string().max(100).optional(),
  ethnicity: z.string().max(100).optional(),
  suggestionNote: z.string().max(500).optional(),
});

export type SuggestFigureInput = z.infer<typeof suggestFigureSchema>;

export { OCCUPATION_VALUES };
