import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

// 1. Duplicate Detection
export function detectDuplicate(
  amount: string,
  note: string,
  categoryId: string,
  recentExpenses: ExpenseWithCategory[]
): boolean {
  if (!amount || !categoryId || recentExpenses.length === 0) return false;
  
  const now = new Date();
  
  // Look at expenses in the last 15 minutes
  const recent = recentExpenses.filter(e => {
    const d = new Date(e.date);
    return (now.getTime() - d.getTime()) < 15 * 60 * 1000;
  });

  return recent.some(e => 
    e.amount.toString() === amount && 
    e.categoryId === categoryId && 
    (e.note?.trim().toLowerCase() === note?.trim().toLowerCase())
  );
}

// 2. Smart Category Suggestion
export function suggestCategory(
  note: string, 
  categories: ExpenseCategory[],
  historicalExpenses?: ExpenseWithCategory[]
): ExpenseCategory | null {
  if (!note || note.trim().length < 3) return null;
  
  const lower = note.toLowerCase().trim();
  
  // Dictionary lookup
  const dictionary: Record<string, string[]> = {
    "food": ["pizza", "burger", "lunch", "dinner", "breakfast", "swiggy", "zomato", "restaurant", "cafe", "tea", "coffee", "snacks", "groceries"],
    "transport": ["uber", "ola", "bus", "train", "metro", "fuel", "petrol", "cab", "flight", "auto", "taxi", "parking"],
    "shopping": ["amazon", "flipkart", "myntra", "clothes", "shoes", "mall", "zara", "h&m"],
    "utilities": ["electricity", "water", "gas", "wifi", "internet", "bill", "recharge", "phone"],
    "entertainment": ["movie", "netflix", "prime", "spotify", "game", "cinema", "concert", "ticket"],
    "health": ["pharmacy", "medicine", "doctor", "hospital", "clinic", "gym"]
  };

  for (const [catName, keywords] of Object.entries(dictionary)) {
    if (keywords.some(k => lower.includes(k))) {
      const match = categories.find(c => c.name.toLowerCase().includes(catName));
      if (match) return match;
    }
  }

  // Fallback: Historical Exact Match
  if (historicalExpenses) {
    const pastMatch = historicalExpenses.find(e => e.note?.toLowerCase().trim() === lower);
    if (pastMatch) {
      return categories.find(c => c.id === pastMatch.categoryId) || null;
    }
  }

  return null;
}

// 3. Auto Complete Notes
export function getAutoCompleteNotes(partialNote: string, expenses: ExpenseWithCategory[]): string[] {
  if (!partialNote || partialNote.trim().length < 2) return [];
  const lower = partialNote.toLowerCase().trim();
  
  const matches = expenses
    .map(e => e.note?.trim())
    .filter((n): n is string => Boolean(n && n.toLowerCase().includes(lower)));

  // Unique matches, max 3
  return Array.from(new Set(matches)).slice(0, 3);
}

// 4. Voice Parser Foundation
export function parseVoiceCommand(text: string, categories: ExpenseCategory[]) {
  // Basic NLP logic to extract Amount, Note, and Category from a string like "Spent 200 on lunch"
  
  // Extract first number found
  const amountMatch = text.match(/\b\d+(\.\d+)?\b/);
  const amount = amountMatch ? amountMatch[0] : "";
  
  // Remove filler words and the amount to guess the note
  let note = text.replace(/spent|paid|for|on|rupees|rs/gi, "")
                 .replace(/\b\d+(\.\d+)?\b/, "")
                 .replace(/[^\w\s]/g, "")
                 .trim();
                 
  note = note.replace(/\s+/g, " "); // collapse whitespace
  
  // Capitalize first letter
  if (note) {
    note = note.charAt(0).toUpperCase() + note.slice(1);
  }

  const suggestedCat = suggestCategory(note, categories);

  return {
    amount,
    note,
    categoryId: suggestedCat?.id || ""
  };
}
