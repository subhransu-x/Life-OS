"use client";

import { useTransition } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Assuming we receive expenses with their categories included
type ExpenseWithCategory = {
  id: string;
  amount: number;
  note: string | null;
  date: Date;
  category: {
    id: string;
    name: string;
    color: string;
  };
};

export function ExpenseList({ expenses }: { expenses: ExpenseWithCategory[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success("Expense deleted successfully");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    });
  };

  if (expenses.length === 0) {
    return <div className="text-gray-500 py-4 text-center border rounded-lg bg-gray-50">No expenses found. Add some!</div>;
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: expense.category.color }}
              ></span>
              <span className="font-medium">{expense.category.name}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(expense.date).toLocaleDateString()} {expense.note && `- ${expense.note}`}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">${Number(expense.amount).toFixed(2)}</span>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(expense.id)}
              disabled={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
