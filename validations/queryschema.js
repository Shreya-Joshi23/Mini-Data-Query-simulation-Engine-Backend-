import { z } from "zod";

export const querySchema = z.object({
  question: z
    .string({ message: "Question must be a string" })
    .min(10, { message: "Minimum length of question must be 10" })
    .max(250, {
      message:
        "Maximum length of question must be 250.Your question exceeding the limit",
    }) 
    .refine((q) => !/\b(DELETE|DROP|ALTER|UPDATE|TRUNCATE)\b/i.test(q), {
        message: " SQL injection detected. Please rephrase your query.",
      })
});
