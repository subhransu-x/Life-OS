/**
 * Shared domain types for the Expense feature.
 * Derived from Prisma query return shapes; serialized for client component use.
 */

export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
};

/**
 * Expense with its category relation included.
 * `amount` is serialized to `number` (from Prisma Decimal) before
 * being passed to Client Components.
 */
export type ExpenseWithCategory = {
  id: string;
  amount: number;
  note: string | null;
  date: Date;
  categoryId: string;
  goalId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: ExpenseCategory;
};
