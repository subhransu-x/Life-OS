export function getCategoryIcon(categoryName: string): string {
  const mapping: Record<string, string> = {
    "Food": "🍔",
    "Transport": "🚗",
    "Rent": "🏠",
    "Education": "📚",
    "Shopping": "🛍️",
    "Health": "❤️",
    "Entertainment": "🎮",
    "Misc": "📦",
  };
  
  return mapping[categoryName] || "💸";
}
