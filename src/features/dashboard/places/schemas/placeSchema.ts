import { z } from "zod";
import {
	PLACE_NAME_MAX_LENGTH,
	PLACE_DESCRIPTION_MAX_LENGTH,
	PLACE_REVIEW_MAX_LENGTH,
	PLACE_CLAIM_MAX_LENGTH,
	PLACE_RESPONSE_MAX_LENGTH,
} from "../constants";

export const suggestPlaceSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(PLACE_NAME_MAX_LENGTH, `Name must be ${PLACE_NAME_MAX_LENGTH} characters or less`),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(PLACE_DESCRIPTION_MAX_LENGTH, `Description must be ${PLACE_DESCRIPTION_MAX_LENGTH} characters or less`),
	type: z.string().min(1, "Type is required"),
	images: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	location: z
		.object({
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
			address: z.string().optional(),
			latitude: z.number().optional(),
			longitude: z.number().optional(),
		})
		.optional(),
});

export type SuggestPlaceFormData = z.infer<typeof suggestPlaceSchema>;

export const claimPlaceSchema = z.object({
	note: z
		.string()
		.min(1, "Note is required")
		.max(PLACE_CLAIM_MAX_LENGTH, `Note must be ${PLACE_CLAIM_MAX_LENGTH} characters or less`),
	proofDocuments: z.array(z.string()).optional(),
});

export type ClaimPlaceFormData = z.infer<typeof claimPlaceSchema>;

export const submitReviewSchema = z.object({
	rating: z.number().min(1, "Rating is required").max(5, "Rating must be 1-5"),
	comment: z
		.string()
		.min(1, "Review comment is required")
		.max(PLACE_REVIEW_MAX_LENGTH, `Review must be ${PLACE_REVIEW_MAX_LENGTH} characters or less`),
});

export type SubmitReviewFormData = z.infer<typeof submitReviewSchema>;

export const respondToReviewSchema = z.object({
	response: z
		.string()
		.min(1, "Response is required")
		.max(PLACE_RESPONSE_MAX_LENGTH, `Response must be ${PLACE_RESPONSE_MAX_LENGTH} characters or less`),
});

export type RespondToReviewFormData = z.infer<typeof respondToReviewSchema>;
