"use client";

import { useState } from "react";
import { getCategoryIcon } from "@/lib/utils/icons";
import { format } from "date-fns";

type CategoryBreakdown = {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
  transactionCount: number;
};

interface MoneyDashboardProps {
  stats: {
    total: number;
    count: number;
    avgPerDay: number;
    largestCategory?: string | null;
  };
  breakdown: CategoryBreakdown[];
}

export function MoneyDashboard({ stats, breakdown }: MoneyDashboardProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const currentMonth = format(new Date(), "MMMM yyyy");

  const selectedCategory = selectedCategoryId 
    ? breakdown.find(c => c.id === selectedCategoryId)
    : null;

  if (stats.count === 0 || breakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-card rounded-2xl border border-border shadow-sm text-center">
        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-4xl">💸</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No spending data yet</h3>
        <p className="text-muted-foreground max-w-md text-base leading-relaxed">
          Track your first transaction to unlock the visual analytics dashboard and start understanding your spending habits.
        </p>
      </div>
    );
  }

  // Calculate SVG donut paths
  const size = 280;
  const strokeWidth = 32;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  
  const createArc = (startAngle: number, endAngle: number) => {
    if (endAngle - startAngle >= 359.9) endAngle -= 0.1;
    const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  const donutSegments = breakdown.reduce((acc, cat) => {
    const isFull = cat.percentage >= 100;
    const angle = (cat.amount / stats.total) * 360;
    const currentAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
    const endAngle = currentAngle + angle;
    const path = isFull ? "" : createArc(currentAngle, endAngle);
    
    acc.push({ ...cat, path, startAngle: currentAngle, endAngle, isFull });
    return acc;
  }, [] as (CategoryBreakdown & { path: string; startAngle: number; endAngle: number; isFull: boolean })[]);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Monthly Hero */}
      <div className="bg-gradient-to-br from-card to-surface/30 border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{currentMonth}</h2>
          <div className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-foreground">
            ₹{stats.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="bg-surface px-3 py-1.5 rounded-lg border border-border/60 shadow-sm text-foreground/80">
              {stats.count} transactions
            </span>
            {stats.largestCategory && (
              <span className="bg-surface px-3 py-1.5 rounded-lg border border-border/60 shadow-sm flex items-center gap-2 text-foreground/80">
                Top Category: <span className="text-base">{getCategoryIcon(stats.largestCategory)}</span> {stats.largestCategory}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Interactive Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-semibold w-full text-left mb-8">Spending Distribution</h3>
          
          <div className="relative flex items-center justify-center w-full max-w-[280px] aspect-square">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90 drop-shadow-sm">
              {donutSegments.map((segment) => (
                segment.isFull ? (
                  <circle
                    key={segment.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setSelectedCategoryId(segment.id)}
                    onMouseLeave={() => setSelectedCategoryId(null)}
                    onClick={() => setSelectedCategoryId(segment.id)}
                  />
                ) : (
                  <path
                    key={segment.id}
                    d={segment.path}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={
                      selectedCategoryId === segment.id ? strokeWidth + 6 : strokeWidth
                    }
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedCategoryId && selectedCategoryId !== segment.id ? "opacity-30" : "opacity-100 hover:opacity-90"
                    }`}
                    onMouseEnter={() => setSelectedCategoryId(segment.id)}
                    onMouseLeave={() => setSelectedCategoryId(null)}
                    onClick={() => setSelectedCategoryId(segment.id)}
                  />
                )
              ))}
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 rounded-full">
              {selectedCategory ? (
                <div className="animate-in fade-in zoom-in duration-200">
                  <div className="text-4xl mb-2">{getCategoryIcon(selectedCategory.name)}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {selectedCategory.name}
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    ₹{selectedCategory.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: selectedCategory.color }}>
                    {selectedCategory.percentage}%
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-200">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                    Total Spent
                  </div>
                  <div className="text-3xl font-bold font-heading tracking-tight text-foreground">
                    ₹{stats.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full max-h-[480px] overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-semibold mb-6 sticky top-0 bg-card z-10 pb-4 border-b border-border/50">
            Top Categories
          </h3>
          
          <div className="space-y-4">
            {breakdown.map((cat) => (
              <div 
                key={cat.id} 
                className={`group transition-all duration-300 p-3 -mx-3 rounded-xl border border-transparent ${
                  selectedCategoryId === cat.id ? "bg-surface border-border shadow-sm" : "hover:bg-surface/50"
                }`}
                onMouseEnter={() => setSelectedCategoryId(cat.id)}
                onMouseLeave={() => setSelectedCategoryId(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border/60 flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-2 mb-0.5">
                        {cat.name}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                          {cat.percentage}%
                        </span>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {cat.transactionCount} transaction{cat.transactionCount !== 1 && "s"}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-foreground tracking-tight">
                    ₹{cat.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 bg-surface border border-border/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${cat.percentage}%`, 
                      backgroundColor: cat.color,
                      opacity: selectedCategoryId && selectedCategoryId !== cat.id ? 0.3 : 1
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
