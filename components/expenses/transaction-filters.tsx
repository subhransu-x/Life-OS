"use client";

import { Search, Filter } from "lucide-react";
import type { ExpenseCategory } from "@/lib/types/expenses";

interface TransactionFiltersProps {
  categories: ExpenseCategory[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  amountFilter: string;
  setAmountFilter: (filter: string) => void;
}

export function TransactionFilters({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategoryId,
  setSelectedCategoryId,
  dateFilter,
  setDateFilter,
  amountFilter,
  setAmountFilter,
}: TransactionFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by note, category, or amount..."
          className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Category Pills */}
        <div className="flex-1 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter by Category
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                selectedCategoryId === null
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-surface border-border/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id === selectedCategoryId ? null : cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? "text-white shadow-sm"
                    : "bg-surface border-border/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
                style={{
                  backgroundColor: selectedCategoryId === cat.id ? cat.color : undefined,
                  borderColor: selectedCategoryId === cat.id ? cat.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedCategoryId === cat.id ? "#fff" : cat.color }}
                />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4 md:w-auto shrink-0">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</h4>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-36 px-3 py-1.5 bg-surface border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</h4>
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="w-full sm:w-36 px-3 py-1.5 bg-surface border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">Any Amount</option>
              <option value="under100">Below ₹100</option>
              <option value="above500">Above ₹500</option>
              <option value="above1000">Above ₹1,000</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
