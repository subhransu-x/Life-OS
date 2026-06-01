import { z } from "zod";

export const createJournalEntrySchema = z.object({
  content: z.string().min(1, { message: "Content cannot be empty" }),
  goalId: z.string().uuid().optional().or(z.literal("")),
});

export const deleteJournalEntrySchema = z.object({
  id: z.string().uuid(),
});

export const updateJournalEntrySchema = createJournalEntrySchema.extend({
  id: z.string().uuid(),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type DeleteJournalEntryInput = z.infer<typeof deleteJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
