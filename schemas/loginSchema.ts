import { z } from "zod";

export const loginForm = z.object({
  email: z.string(),
  studentId: z.string(),
});

export type LoginForm = z.infer<typeof loginForm>;
