"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBudgetStore } from "@/lib/store/budget-store";
import type { ExpenseCategory } from "@/lib/types/expenses";

interface BudgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ExpenseCategory[];
}

export function BudgetConfigModal({ isOpen, onClose, categories }: BudgetConfigModalProps) {
  const { monthlyBudget, setMonthlyBudget, categoryBudgets, setCategoryBudget } = useBudgetStore();
  const [localMonthly, setLocalMonthly] = useState(monthlyBudget.toString());
  const [localCategories, setLocalCategories] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLocalMonthly(monthlyBudget.toString());
        const acc: Record<string, string> = {};
        Object.keys(categoryBudgets).forEach(id => {
          acc[id] = categoryBudgets[id].toString();
        });
        setLocalCategories(acc);
      }, 0);
    }
  }, [isOpen, monthlyBudget, categoryBudgets]);

  const handleSave = () => {
    const parsedMonthly = parseInt(localMonthly.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsedMonthly)) {
      setMonthlyBudget(parsedMonthly);
    }

    categories.forEach(cat => {
      const val = localCategories[cat.id];
      if (val) {
        const parsedCat = parseInt(val.replace(/[^0-9]/g, ""), 10);
        setCategoryBudget(cat.id, isNaN(parsedCat) ? null : parsedCat);
      } else {
        setCategoryBudget(cat.id, null);
      }
    });
    
    onClose();
  };

  const handleCategoryChange = (id: string, value: string) => {
    setLocalCategories(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Configure Budgets">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Total Monthly Budget (₹)</label>
          <input 
            type="number" 
            value={localMonthly}
            onChange={(e) => setLocalMonthly(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-mono"
            placeholder="e.g. 15000"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center justify-between">
            Category Budgets
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-normal bg-surface px-2 py-0.5 rounded">Optional</span>
          </label>
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-32 shrink-0 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
                </div>
                <input 
                  type="number"
                  value={localCategories[cat.id] || ""}
                  onChange={(e) => handleCategoryChange(cat.id, e.target.value)}
                  placeholder="No limit"
                  className="flex-1 px-3 py-2 bg-surface border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm font-mono placeholder:text-muted-foreground/50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSave} className="bg-foreground text-background rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-md font-semibold">Save Budgets</Button>
        </div>
      </div>
    </Dialog>
  );
}
