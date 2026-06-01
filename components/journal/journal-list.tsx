"use client";

import { useTransition, useState } from "react";
import { deleteJournalEntry } from "@/lib/actions/journal";
import { Button } from "@/components/ui/button";
import { JournalEntry } from "@prisma/client";

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteJournalEntry(id);
        // Optional: show a toast here if toast is available
      } catch (error) {
        console.error("[JournalList] deleteJournalEntry failed:", error);
      } finally {
        setPendingId(null);
      }
    });
  };

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-gray-50 text-gray-500">
        No journal entries yet. Start writing!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="p-4 border rounded-lg shadow-sm bg-white space-y-3"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(entry.id)}
              disabled={pendingId === entry.id}
              aria-label="Delete entry"
            >
              {pendingId === entry.id ? "Deleting…" : "Delete"}
            </Button>
          </div>
          <div className="whitespace-pre-wrap text-gray-800">
            {entry.content}
          </div>
        </div>
      ))}
    </div>
  );
}
