import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, { message: "Habit name is required" }),
  color: z.string().min(1, { message: "Color is required" }),
});

export const deleteHabitSchema = z.object({
  id: z.string().uuid(),
});

export const toggleHabitSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
  logId: z.string().uuid().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type DeleteHabitInput = z.infer<typeof deleteHabitSchema>;
export type ToggleHabitInput = z.infer<typeof toggleHabitSchema>;
