import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BudgetState {
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
  setMonthlyBudget: (amount: number) => void;
  setCategoryBudget: (categoryId: string, amount: number | null) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      monthlyBudget: 15000,
      categoryBudgets: {},
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),
      setCategoryBudget: (categoryId, amount) => set((state) => {
        const newCategoryBudgets = { ...state.categoryBudgets };
        if (amount === null || amount <= 0) {
          delete newCategoryBudgets[categoryId];
        } else {
          newCategoryBudgets[categoryId] = amount;
        }
        return { categoryBudgets: newCategoryBudgets };
      })
    }),
    {
      name: "life-os-budget-storage",
    }
  )
);
