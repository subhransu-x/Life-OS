"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createJournalEntrySchema, updateJournalEntrySchema } from "@/lib/validations/journal";
import { addXP } from "@/lib/queries/gamification";
import { runProgressionUpdate } from "@/lib/queries/progression";

export async function createJournalEntry(formData: { content: string; goalId?: string }) {
  const result = createJournalEntrySchema.safeParse(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const entry = await db.journalEntry.create({
    data: {
      content: result.data.content,
      goalId: result.data.goalId || null,
    },
  });

  await addXP(20);
  await runProgressionUpdate("journal");

  revalidatePath("/journal");
  return entry;
}

export async function deleteJournalEntry(id: string) {
  await db.journalEntry.delete({
    where: { id },
  });

  revalidatePath("/journal");
}

export async function updateJournalEntry(id: string, formData: { content: string; goalId?: string }) {
  const result = updateJournalEntrySchema.safeParse({ id, ...formData });

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const entry = await db.journalEntry.update({
    where: { id: result.data.id },
    data: {
      content: result.data.content,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/journal");
  revalidatePath("/goals/[id]", "page");
  return entry;
}
