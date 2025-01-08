import { z } from "zod";

const questionnaireSchema = z.object({
  id: z.string(),
  examFormId: z.string(),
  question: z.string(),
  choices: z.array(z.string()),
  answer: z.string(),
  studentAnswer: z.string(),
  number: z.number(),
  isCorrect: z.boolean().nullable(),
  resultId: z.string().nullable(),
});

export const resultSchema = z.object({
  questionnaires: z.array(questionnaireSchema),
  studentId: z.string(),
});

export type ResultZod = z.infer<typeof resultSchema>;
