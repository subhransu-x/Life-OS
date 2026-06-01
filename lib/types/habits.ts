/**
 * Shared domain types for the Habit feature.
 * Derived from Prisma query return shapes; serialized for client component use.
 */

import type { Habit, HabitLog } from "@prisma/client";

export type HabitWithLogs = Habit & {
  logs: HabitLog[];
};

/** Per-habit streak count, keyed by habit ID */
export type HabitStreak = number;
