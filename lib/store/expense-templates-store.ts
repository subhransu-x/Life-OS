import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ExpenseTemplate {
  id: string;
  name: string;
  amount: string;
  categoryId: string;
  note: string;
  icon: string;
}

interface ExpenseTemplateState {
  templates: ExpenseTemplate[];
  fastEntryScores: number[]; // Stores recent log times in milliseconds
  addTemplate: (template: Omit<ExpenseTemplate, "id">) => void;
  removeTemplate: (id: string) => void;
  recordEntryTime: (timeMs: number) => void;
  getAverageEntryTime: () => number;
}

export const useExpenseTemplateStore = create<ExpenseTemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      fastEntryScores: [],
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, { ...template, id: Math.random().toString(36).substr(2, 9) }]
      })),
      removeTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id)
      })),
      recordEntryTime: (timeMs) => set((state) => {
        const newScores = [...state.fastEntryScores, timeMs].slice(-50); // Keep the last 50 entries
        return { fastEntryScores: newScores };
      }),
      getAverageEntryTime: () => {
        const scores = get().fastEntryScores;
        if (scores.length === 0) return 0;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    }),
    {
      name: "expense-templates-storage",
    }
  )
);
