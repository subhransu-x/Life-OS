import { db } from "@/lib/db";

export async function getJournalEntries() {
  return await db.journalEntry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getJournalEntryById(id: string) {
  return await db.journalEntry.findUnique({
    where: { id },
  });
}
