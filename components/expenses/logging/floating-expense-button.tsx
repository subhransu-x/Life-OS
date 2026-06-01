"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuickAddSheet } from "./quick-add-sheet";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";

export function FloatingExpenseButton({
  categories,
  expenses
}: {
  categories: ExpenseCategory[];
  expenses: ExpenseWithCategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none" />
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <QuickAddSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
        expenses={expenses}
      />
    </>
  );
}
