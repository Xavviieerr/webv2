import { z } from "zod";

export const classApplicationSchema = z.object({
	fullName: z.string().trim().min(2, "requiredField"),
	phone: z.string().trim().min(6, "requiredField"),
	location: z.string().trim().min(1, "requiredField"),
	audience: z.string().min(1, "requiredField"),
	level: z.string().min(1, "requiredField"),
	goals: z.array(z.string()).min(1, "selectAtLeastOneGoal"),
	dialect: z.string().min(1, "requiredField"),
	sessionTime: z.string().min(1, "requiredField"),
	packageInterest: z.string().min(1, "requiredField"),
	practiceTime: z.string().min(1, "requiredField"),
	message: z.string().trim().optional(),
	consent: z.boolean().refine((value) => value, "consentRequired"),
});

export type ClassApplicationInput = z.infer<typeof classApplicationSchema>;
