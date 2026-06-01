"use client";

import { useState, useMemo } from "react";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import { TransactionFilters } from "@/components/expenses/transaction-filters";
import { calculateExpenseStats, getSpendingIndicators } from "@/lib/utils/timeline";
import { isThisMonth } from "date-fns";
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

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all"); // "all", "7days", "month", "lastMonth"
  const [amountFilter, setAmountFilter] = useState("all"); // "all", "under100", "above500", "above1000"

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setEditingExpense(null), 200);
  };

  // Memoized Filtering Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // 1. Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesNote = exp.note?.toLowerCase().includes(query);
        const matchesCat = exp.category.name.toLowerCase().includes(query);
        const matchesAmount = exp.amount.toString().includes(query);
        if (!matchesNote && !matchesCat && !matchesAmount) return false;
      }
      
      // 2. Category Filter
      if (selectedCategoryId && exp.categoryId !== selectedCategoryId) return false;

      // 3. Date Filter
      if (dateFilter !== "all") {
        const date = new Date(exp.date);
        const now = new Date();
        if (dateFilter === "7days") {
          const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
          if (diff > 7) return false;
        } else if (dateFilter === "month") {
          if (!isThisMonth(date)) return false;
        } else if (dateFilter === "lastMonth") {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          if (date.getMonth() !== lastMonth.getMonth() || date.getFullYear() !== lastMonth.getFullYear()) return false;
        }
      }

      // 4. Amount Filter
      const amt = Number(exp.amount);
      if (amountFilter === "under100" && amt >= 100) return false;
      if (amountFilter === "above500" && amt <= 500) return false;
      if (amountFilter === "above1000" && amt <= 1000) return false;

      return true;
    });
  }, [expenses, searchQuery, selectedCategoryId, dateFilter, amountFilter]);

  // Derived Stats
  const stats = useMemo(() => calculateExpenseStats(filteredExpenses), [filteredExpenses]);
  const indicators = useMemo(() => getSpendingIndicators(filteredExpenses), [filteredExpenses]);

  return (
    <>
      <div className="flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-foreground tracking-tight">Timeline</h2>
            <Button 
              onClick={() => setIsOpen(true)} 
              className="rounded-full shadow-md bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 gap-2 hidden md:flex items-center h-10 px-5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Add Expense</span>
            </Button>
          </div>
          
          <TransactionFilters 
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            amountFilter={amountFilter}
            setAmountFilter={setAmountFilter}
          />
        </div>

        {/* Transaction Statistics Header */}
        <div className="bg-surface-elevated/50 border border-border rounded-2xl p-5 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between shadow-sm">
          <div className="flex gap-x-8 gap-y-4 flex-wrap">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Transactions</div>
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">{stats.count}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Average</div>
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">₹{stats.average.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Largest</div>
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">₹{stats.largest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex gap-2 flex-wrap">
            {indicators.map((ind, i) => (
              <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm ${
                ind.type === "warning" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-surface border-border/60 text-muted-foreground"
              }`}>
                <span className="text-sm">{ind.icon}</span> {ind.label}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline List */}
        <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} />
      </div>

      {/* Edit/Add Modal */}
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

      {/* Premium Floating Action Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-foreground hover:bg-foreground/90 text-background rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
