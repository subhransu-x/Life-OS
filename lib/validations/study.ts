import { z } from "zod";

export const createDeckSchema = z.object({
  name: z.string().min(1, { message: "Deck name is required" }),
  description: z.string().optional(),
  color: z.string().min(1),
  goalId: z.string().uuid().optional().or(z.literal("")),
});

export const updateDeckSchema = createDeckSchema.extend({
  id: z.string().uuid(),
});

export const createFlashcardSchema = z.object({
  front: z.string().min(1, { message: "Front side is required" }),
  back: z.string().min(1, { message: "Back side is required" }),
  deckId: z.string().uuid(),
});

export const updateFlashcardSchema = createFlashcardSchema.extend({
  id: z.string().uuid(),
});

// Quality is 0-4 (0: Blackout, 1: Incorrect, 2: Hard, 3: Good, 4: Easy)
export const reviewFlashcardSchema = z.object({
  id: z.string().uuid(),
  quality: z.number().int().min(0).max(4),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardSchema>;
export type ReviewFlashcardInput = z.infer<typeof reviewFlashcardSchema>;
