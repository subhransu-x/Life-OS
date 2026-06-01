"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";
import type { Goal } from "@prisma/client";

interface ExpensesPageContentProps {
  expenses: ExpenseWithCategory[];
  categories: ExpenseCategory[];
  goals: Goal[];
}

export function ExpensesPageContent({ expenses, categories, goals }: ExpensesPageContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null);

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setEditingExpense(null), 200); // clear after animation
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Transactions</h2>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95 text-white gap-2 flex items-center h-9 px-4 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </Button>
        </div>

        <ExpenseList expenses={expenses} onEdit={handleEdit} />
      </div>

      <Dialog isOpen={isOpen} onClose={handleClose} title={editingExpense ? "Edit Expense" : "Add Expense"}>
        <ExpenseForm 
          categories={categories} 
          goals={goals} 
          initialData={editingExpense ? {
            id: editingExpense.id,
            amount: Number(editingExpense.amount),
            note: editingExpense.note || "",
            date: new Date(editingExpense.date).toISOString().split("T")[0],
            categoryId: editingExpense.categoryId,
            goalId: editingExpense.goalId || "",
          } : undefined}
          onSuccess={handleClose} 
        />
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
