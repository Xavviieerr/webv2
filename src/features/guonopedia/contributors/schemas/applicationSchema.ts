import { z } from "zod";
import { CONTRIBUTOR_SCOPES } from "../types";

export const contributorApplicationSchema = z.object({
	scopes: z
		.array(z.enum(CONTRIBUTOR_SCOPES))
		.min(1, "selectAtLeastOneScope"),
	applicationNote: z
		.string()
		.trim()
		.max(1000, "applicationNoteTooLong")
		.optional(),
	expertise: z.string().trim().max(120, "expertiseTooLong").optional(),
	agree: z
		.boolean()
		.refine((value) => value, "agreeContributorPolicyRequired"),
});

export type ContributorApplicationInput = z.infer<
	typeof contributorApplicationSchema
>;
