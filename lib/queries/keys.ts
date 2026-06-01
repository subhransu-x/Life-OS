/**
 * Centralized TanStack Query cache keys for the Life OS application.
 * Importing from this single source of truth prevents typo-related cache invalidation bugs.
 * 
 * Example usage:
 * export const QUERY_KEYS = {
 *   expenses: {
 *     all: ['expenses'] as const,
 *     list: (filters: any) => [...QUERY_KEYS.expenses.all, 'list', filters] as const,
 *     detail: (id: string) => [...QUERY_KEYS.expenses.all, 'detail', id] as const,
 *   },
 * }
 */
export const QUERY_KEYS = {
  // To be populated in Build C (Expenses), Build D (Journal), and Build E (Habits)
} as const;
