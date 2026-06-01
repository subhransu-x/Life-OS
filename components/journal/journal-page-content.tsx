"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { JournalForm } from "@/components/journal/journal-form";
import { JournalList } from "@/components/journal/journal-list";
import type { JournalEntry, Goal } from "@prisma/client";

interface JournalPageContentProps {
  entries: JournalEntry[];
  goals: Goal[];
}

export function JournalPageContent({ entries, goals }: JournalPageContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setEditingEntry(null), 200);
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Past Entries</h2>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="rounded-full shadow-lg bg-violet-500 hover:bg-violet-600 hover:scale-105 active:scale-95 text-white gap-2 flex items-center h-9 px-4 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write Entry</span>
          </Button>
        </div>

        <JournalList entries={entries} onEdit={handleEdit} />
      </div>

      <Dialog isOpen={isOpen} onClose={handleClose} title={editingEntry ? "Edit Entry" : "New Journal Entry"}>
        <JournalForm 
          goals={goals} 
          initialData={editingEntry ? {
            id: editingEntry.id,
            content: editingEntry.content,
            goalId: editingEntry.goalId || "",
          } : undefined}
          onSuccess={handleClose} 
        />
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-violet-500 hover:bg-violet-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-violet-400"
        aria-label="Write Journal Entry"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
