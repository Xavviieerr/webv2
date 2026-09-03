import { z } from "zod";
import { SUBJECT_MAX_LENGTH, MESSAGE_MAX_LENGTH } from "../constants";

export const createTicketSchema = z.object({
  category: z.enum(["bug", "feedback", "complaint", "other"]),
  subject: z.string().min(1, "Subject is required").max(SUBJECT_MAX_LENGTH, `Subject must be ${SUBJECT_MAX_LENGTH} characters or less`),
  message: z.string().min(1, "Message is required").max(MESSAGE_MAX_LENGTH, `Message must be ${MESSAGE_MAX_LENGTH} characters or less`),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
