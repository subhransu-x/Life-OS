"use client";

import { useTransition, useState } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Trash2, Wallet, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { EmptyState } from "@/components/ui/empty-state";

export function ExpenseList({
  expenses,
  onEdit,
}: {
  expenses: ExpenseWithCategory[];
  onEdit: (expense: ExpenseWithCategory) => void;
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
      <EmptyState
        icon={Wallet}
        title="No expenses tracked yet"
        description="Your first entry helps you understand where your money goes. Track a small purchase today."
      />
    );
  }

  // Group by date string (YYYY-MM-DD)
  const grouped = expenses.reduce((acc, expense) => {
    // Format to YYYY-MM-DD local time for grouping
    const dateStr = new Date(expense.date).toLocaleDateString("en-CA");
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(expense);
    return acc;
  }, {} as Record<string, ExpenseWithCategory[]>);

  // Sort groups descending
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatGroupHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    // eslint-disable-next-line react-hooks/purity
    const today = new Date().toLocaleDateString("en-CA");
    // eslint-disable-next-line react-hooks/purity
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short"
    });
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((dateStr) => (
        <div key={dateStr} className="space-y-3 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-border/50 before:-z-10 ml-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-background py-2 inline-block relative z-10 pl-1">
            {formatGroupHeader(dateStr)}
          </h3>
          <div className="space-y-2">
            {grouped[dateStr].map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-surface/50 hover:bg-surface-elevated/80 transition-colors group relative ml-6 border border-transparent hover:border-border/50"
              >
                {/* Timeline dot */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-[29px] w-[9px] h-[9px] rounded-full border-2 border-background" style={{ backgroundColor: expense.category.color }} />
                
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${expense.category.color}15` }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: expense.category.color }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground tracking-wide flex items-center gap-2">
                      {expense.category.name}
                    </div>
                    {expense.note && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate pr-4">
                        {expense.note}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <span className="font-semibold text-sm md:text-base text-foreground tabular-nums tracking-tight">
                    ₹{Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  <button
                    onClick={() => onEdit(expense)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/10 disabled:opacity-50"
                    aria-label={`Edit expense`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={pendingId === expense.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-status-danger rounded-xl hover:bg-status-danger/10 disabled:opacity-50"
                    aria-label={`Delete expense of ₹${Number(expense.amount).toFixed(2)} on ${new Date(expense.date).toLocaleDateString()}`}
                  >
                    {pendingId === expense.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-status-danger border-t-transparent animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
