"use client";

import { useState } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Trash2, Edit2, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { EmptyState } from "@/components/ui/empty-state";
import { groupExpensesBySmartTimeline } from "@/lib/utils/timeline";
import { getCategoryIcon } from "@/lib/utils/icons";
import { format } from "date-fns";

export function ExpenseList({
  expenses,
  onEdit,
}: {
  expenses: ExpenseWithCategory[];
  onEdit: (expense: ExpenseWithCategory) => void;
}) {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleDelete = (id: string) => {
    // Optimistically hide the expense
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    let isUndone = false;

    toast("Expense removed", {
      description: "It will be permanently deleted in 5 seconds.",
      action: {
        label: "Undo",
        onClick: () => {
          isUndone = true;
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          toast.success("Expense restored");
        },
      },
      duration: 5000,
    });

    // Schedule actual deletion
    setTimeout(async () => {
      if (!isUndone) {
        try {
          await deleteExpense(id);
        } catch (error) {
          console.error("[ExpenseList] deleteExpense failed:", error);
          toast.error("Failed to delete expense permanently.");
          // Restore visually if the backend deletion failed
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      }
    }, 5100);
  };

  const visibleExpenses = expenses.filter((exp) => !deletedIds.has(exp.id));

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-surface-elevated border border-border/50 border-dashed rounded-[2.5rem] shadow-sm animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-inner rotate-3">
          <Zap className="w-10 h-10 fill-primary/20" />
        </div>
        <h3 className="text-2xl font-black font-heading mb-3">No expenses yet</h3>
        <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
          Start tracking your spending to unlock financial intelligence. Tap the <strong className="text-foreground">floating + button</strong> in the bottom right to log your first expense in seconds.
        </p>
      </div>
    );
  }

  const timelineGroups = groupExpensesBySmartTimeline(visibleExpenses);

  if (timelineGroups.length === 0) {
    return null; // All items are pending deletion
  }

  return (
    <div className="space-y-10">
      {timelineGroups.map((group) => (
        <div key={group.label} className="relative">
          {/* Group Header */}
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 -mx-2 px-2">
            <h3 className="text-sm font-bold text-foreground capitalize tracking-wide">
              {group.label}
            </h3>
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <span>{group.count} trans.</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>₹{group.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Timeline Connector */}
          <div className="absolute top-10 bottom-0 left-[23px] w-px bg-border/50 -z-10 hidden sm:block" />

          {/* Group Items */}
          <div className="space-y-3">
            {group.expenses.map((expense) => {
              const timeString = format(new Date(expense.date), "h:mm a");

              return (
                <div
                  key={expense.id}
                  className="group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-surface/40 hover:bg-surface-elevated/80 transition-all border border-border/40 hover:border-border hover:shadow-sm sm:ml-12 animate-in fade-in zoom-in-95 duration-200"
                >
                  {/* Timeline dot (Desktop only) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -left-[29px] w-3 h-3 rounded-full border-[3px] border-background hidden sm:block transition-transform group-hover:scale-125"
                    style={{ backgroundColor: expense.category.color }}
                  />

                  <div className="flex-1 min-w-0 flex items-center gap-3 sm:gap-4">
                    {/* Premium Category Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-border/20 transition-transform group-hover:rotate-3"
                      style={{ backgroundColor: `${expense.category.color}15` }}
                    >
                      <span className="text-xl drop-shadow-sm">
                        {getCategoryIcon(expense.category.name)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                          {expense.category.name}
                        </span>
                        {expense.goalId && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            Goal
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground gap-2 truncate">
                        <span className="flex items-center gap-1 shrink-0 text-foreground/60 font-medium">
                          <Clock className="w-3 h-3" /> {timeString}
                        </span>
                        {expense.note && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                            <span className="truncate pr-4 italic">&quot;{expense.note}&quot;</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                    <span className="font-bold text-base sm:text-lg text-foreground tabular-nums tracking-tight">
                      ₹{Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                        aria-label="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1.5 text-muted-foreground hover:text-status-danger rounded-lg hover:bg-status-danger/10 transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
