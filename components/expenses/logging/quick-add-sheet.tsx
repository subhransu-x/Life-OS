"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createExpense } from "@/lib/actions/expenses";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";
import { SmartAmountInput } from "./smart-amount-input";
import { RecentSuggestions } from "./recent-suggestions";
import { ExpenseTemplates } from "./expense-templates";
import { suggestCategory, getAutoCompleteNotes, detectDuplicate } from "@/lib/utils/logging-intelligence";
import { useExpenseTemplateStore } from "@/lib/store/expense-templates-store";
import { X, Check, Loader2, Sparkles, AlertTriangle } from "lucide-react";

export function QuickAddSheet({
  isOpen,
  onClose,
  categories,
  expenses
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: ExpenseCategory[];
  expenses: ExpenseWithCategory[];
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const { recordEntryTime } = useExpenseTemplateStore();
  const startTime = useRef<number>(0);

  // Suggestions
  const [noteSuggestions, setNoteSuggestions] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startTime.current = Date.now();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNote("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryId(categories[0]?.id || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDuplicateWarning(false);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, categories]);

  // Handle Note Change & Auto-Category
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNote(val);
    
    // Auto complete
    setNoteSuggestions(getAutoCompleteNotes(val, expenses));
    
    // Auto category
    const suggestedCat = suggestCategory(val, categories, expenses);
    if (suggestedCat) {
      setCategoryId(suggestedCat.id);
    }
  };

  const handleTemplateSelect = (a: string, n: string, cId: string) => {
    setAmount(a);
    setNote(n);
    if (cId) setCategoryId(cId);
    
    // Auto submit on template tap if we have all data
    if (a && cId) {
      submitExpense(a, n, cId);
    }
  };

  const submitExpense = (finalAmount = amount, finalNote = note, finalCat = categoryId) => {
    if (!finalAmount || !finalCat) return;

    // Duplicate check if not bypassed
    if (!duplicateWarning && detectDuplicate(finalAmount, finalNote, finalCat, expenses)) {
      setDuplicateWarning(true);
      return; // Stop and require second tap
    }

    startTransition(async () => {
      await createExpense({
        amount: Number(finalAmount),
        categoryId: finalCat,
        note: finalNote,
        date: new Date().toISOString(),
      });
      
      // Record speed
      const timeMs = Date.now() - startTime.current;
      recordEntryTime(timeMs);
      
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl rounded-t-[2.5rem] p-6 pb-8 animate-in slide-in-from-bottom-full duration-300 max-w-lg mx-auto">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-border rounded-full" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-surface hover:bg-surface-elevated rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-4">
          <ExpenseTemplates categories={categories} onSelect={handleTemplateSelect} />
        </div>

        <div className="mt-6">
          <SmartAmountInput value={amount} onChange={setAmount} autoFocus={isOpen} />
        </div>

        {duplicateWarning && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl mb-4 text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Possible duplicate expense. Tap Save again to confirm.
          </div>
        )}

        <div className="space-y-4">
          {/* Note Input */}
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={handleNoteChange}
              placeholder="What was this for?"
              className="w-full bg-surface-elevated border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl px-4 py-3.5 outline-none transition-all"
            />
            {noteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 flex gap-2 overflow-x-auto hide-scrollbar z-10">
                {noteSuggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setNote(s);
                      setNoteSuggestions([]);
                      const cat = suggestCategory(s, categories, expenses);
                      if (cat) setCategoryId(cat.id);
                    }}
                    className="px-3 py-1.5 bg-surface border border-border text-xs rounded-lg whitespace-nowrap shadow-sm hover:border-primary/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  categoryId === cat.id
                    ? "bg-background text-foreground border-primary shadow-sm ring-1 ring-primary"
                    : "bg-surface text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <RecentSuggestions expenses={expenses} onSelect={handleTemplateSelect} />
          </div>

          <button
            disabled={!amount || !categoryId || isPending}
            onClick={() => submitExpense()}
            className="w-full py-4 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
            <span className="text-lg">{duplicateWarning ? "Confirm Save" : "Save Expense"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
