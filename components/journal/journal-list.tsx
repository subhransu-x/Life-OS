"use client";

import { useTransition, useState } from "react";
import { deleteJournalEntry } from "@/lib/actions/journal";
import { BookOpen, Edit2 } from "lucide-react";
import { JournalEntry } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";

export function JournalList({ 
  entries,
  onEdit 
}: { 
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteJournalEntry(id);
      } catch (error) {
        console.error("[JournalList] deleteJournalEntry failed:", error);
      } finally {
        setPendingId(null);
      }
    });
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="This is your space"
        description="No one reads this but you. Start with how your day is going."
      />
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const wordCount = entry.content.trim().split(/\s+/).length;

        return (
          <div
            key={entry.id}
            className="p-6 md:p-8 rounded-3xl glass-card hover:bg-surface-elevated/40 spring-transition space-y-4 group relative overflow-hidden"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground tracking-tight">
                  {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="text-sm text-muted-foreground/60">
                  {new Date(entry.createdAt).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <span className="text-xs text-muted-foreground/40 tabular-nums px-2 py-0.5 rounded-md bg-surface">
                  {wordCount} word{wordCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(entry)}
                  disabled={pendingId === entry.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/10 disabled:opacity-50"
                  aria-label="Edit entry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={pendingId === entry.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-status-danger rounded-xl hover:bg-status-danger/10 disabled:opacity-50"
                  aria-label="Delete entry"
                >
                  {pendingId === entry.id ? (
                    <div className="w-4 h-4 rounded-full border-2 border-status-danger border-t-transparent animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-base text-foreground/90 leading-relaxed font-serif tracking-wide">
              {entry.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
