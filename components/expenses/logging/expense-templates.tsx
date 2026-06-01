"use client";

import { useExpenseTemplateStore } from "@/lib/store/expense-templates-store";
import { Star } from "lucide-react";
import type { ExpenseCategory } from "@/lib/types/expenses";

export function ExpenseTemplates({
  categories,
  onSelect
}: {
  categories: ExpenseCategory[];
  onSelect: (amount: string, note: string, categoryId: string) => void;
}) {
  const { templates } = useExpenseTemplateStore();

  if (templates.length === 0) return null;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow-500 ml-1">
        <Star className="w-3 h-3 fill-yellow-500" /> Favorites
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 px-1">
        {templates.map((t) => {
          const cat = categories.find(c => c.id === t.categoryId);
          
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.amount, t.note, t.categoryId)}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10 active:scale-95 rounded-xl whitespace-nowrap transition-all shrink-0 shadow-sm"
            >
              <span className="text-base leading-none">{t.icon}</span>
              <span className="text-sm font-bold text-foreground">{t.name}</span>
              <span className="text-sm font-mono font-bold text-yellow-600 dark:text-yellow-500 ml-1">₹{t.amount}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}
