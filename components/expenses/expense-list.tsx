"use client";

import { useTransition, useState } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ExpenseWithCategory } from "@/lib/types/expenses";

export function ExpenseList({
  expenses,
}: {
  expenses: ExpenseWithCategory[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success("Expense deleted");
      } catch (error) {
        console.error("[ExpenseList] deleteExpense failed:", error);
        toast.error("Failed to delete expense. Please try again.");
      } finally {
        setPendingId(null);
      }
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-gray-50 text-gray-500">
        No expenses yet. Add your first one!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: expense.category.color }}
                aria-hidden="true"
              />
              <span className="font-medium truncate">{expense.category.name}</span>
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {new Date(expense.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {expense.note && (
                <span className="ml-2 text-gray-400">— {expense.note}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <span className="font-bold text-lg tabular-nums">
              ₹{Number(expense.amount).toFixed(2)}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(expense.id)}
              disabled={pendingId === expense.id}
              aria-label={`Delete expense of ₹${Number(expense.amount).toFixed(2)} on ${new Date(expense.date).toLocaleDateString()}`}
            >
              {pendingId === expense.id ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
