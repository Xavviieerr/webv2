import { z } from "zod";
import { PLACE_NAME_MAX_LENGTH, PLACE_DESCRIPTION_MAX_LENGTH } from "../constants";

export const updatePlaceSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(PLACE_NAME_MAX_LENGTH, `Name must be ${PLACE_NAME_MAX_LENGTH} characters or less`)
		.optional(),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(PLACE_DESCRIPTION_MAX_LENGTH, `Description must be ${PLACE_DESCRIPTION_MAX_LENGTH} characters or less`)
		.optional(),
	type: z.string().min(1, "Type is required").optional(),
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

export type UpdatePlaceFormData = z.infer<typeof updatePlaceSchema>;
