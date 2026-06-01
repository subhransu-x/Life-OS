import { z } from "zod";

export const createGoalSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  domain: z.string().min(1, { message: "Domain is required" }),
  // Form submits string; preprocess empty strings to undefined, then coerce to Date
  targetDate: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.coerce.date().optional()
  ),
});

export const updateGoalProgressSchema = z.object({
  id: z.string().uuid(),
  progress: z.number().min(0).max(100),
});

export const deleteGoalSchema = z.object({
  id: z.string().uuid(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalProgressInput = z.infer<typeof updateGoalProgressSchema>;
export type DeleteGoalInput = z.infer<typeof deleteGoalSchema>;
