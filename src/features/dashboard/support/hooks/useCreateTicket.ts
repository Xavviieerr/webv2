import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCreateTicketMutation } from "../api/supportEndpoints";
import { createTicketSchema } from "../schemas/supportSchema";
import type { CreateTicketInput } from "../schemas/supportSchema";
import type { TicketCategory } from "../types";

interface UseCreateTicketReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
  handleSubmit: (data: CreateTicketInput) => Promise<void>;
  reset: () => void;
  setCategory: (category: TicketCategory) => void;
  setSubject: (subject: string) => void;
  setMessage: (message: string) => void;
  category: TicketCategory;
  subject: string;
  message: string;
}

export function useCreateTicket(): UseCreateTicketReturn {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState<TicketCategory>("feedback");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (data: CreateTicketInput) => {
      setErrors({});
      const result = createTicketSchema.safeParse(data);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }

      try {
        await createTicket(result.data).unwrap();
        setIsSuccess(true);
        toast.success("Support ticket submitted successfully");
      } catch (err: unknown) {
        const apiError = err as { data?: { message?: string }; message?: string };
        toast.error(apiError?.data?.message || apiError?.message || "Failed to submit ticket");
      }
    },
    [createTicket],
  );

  const reset = useCallback(() => {
    setIsSuccess(false);
    setErrors({});
    setCategory("feedback");
    setSubject("");
    setMessage("");
  }, []);

  return {
    isSubmitting: isLoading,
    isSuccess,
    errors,
    handleSubmit,
    reset,
    category,
    subject,
    message,
    setCategory,
    setSubject,
    setMessage,
  };
}
