"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createJournalEntrySchema } from "@/lib/validations/journal";

export async function createJournalEntry(formData: { content: string }) {
  const result = createJournalEntrySchema.safeParse(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const entry = await db.journalEntry.create({
    data: {
      content: result.data.content,
    },
  });

  revalidatePath("/journal");
  return entry;
}

export async function deleteJournalEntry(id: string) {
  await db.journalEntry.delete({
    where: { id },
  });

  revalidatePath("/journal");
}
