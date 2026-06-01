import { z } from "zod";

/**
 * Single source of truth for expense Zod schemas.
 * Used by both server actions and client-side forms.
 * Compatible with Zod v4 error option API.
 */

export const createExpenseSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number" })
    .positive({ message: "Amount must be positive" }),
  note: z.string().optional(),
  // Form submits a YYYY-MM-DD string; coerce to Date on the server
  date: z.coerce.date({ error: "Valid date is required" }),
  categoryId: z.string().uuid({ message: "Please select a category" }),
});

export const deleteExpenseSchema = z.object({
  id: z.string().uuid(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>;
