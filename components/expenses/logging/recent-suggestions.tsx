"use client";

import { useMemo } from "react";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { Clock } from "lucide-react";

export function RecentSuggestions({ 
  expenses,
  onSelect
}: { 
  expenses: ExpenseWithCategory[];
  onSelect: (amount: string, note: string, categoryId: string) => void;
}) {
  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    const unique: ExpenseWithCategory[] = [];
    
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const exp of sorted) {
      if (!exp.note) continue;
      
      const key = `${exp.note.toLowerCase().trim()}-${exp.categoryId}-${exp.amount}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(exp);
      }
      if (unique.length >= 8) break;
    }
    return unique;
  }, [expenses]);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
        <Clock className="w-3 h-3" /> Recent Items
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 px-1">
        {suggestions.map((exp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(exp.amount.toString(), exp.note || "", exp.categoryId)}
            className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border/60 hover:border-primary/50 hover:bg-surface active:scale-95 rounded-xl whitespace-nowrap transition-all shrink-0 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: exp.category.color }} />
            <span className="text-sm font-bold text-foreground">{exp.note}</span>
            <span className="text-sm font-mono font-bold text-muted-foreground ml-1">₹{exp.amount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
