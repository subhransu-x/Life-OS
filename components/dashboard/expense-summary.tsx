"use client";

import Link from "next/link";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type ExpenseSummaryProps = {
  total: number;
  count?: number;
};

export function ExpenseSummary({ total }: ExpenseSummaryProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const budget = 25000;
  const isOverBudget = total > budget;
  
  // Mock trend data
  const trend = -12.5;
  const isTrendGood = trend < 0; // Less spending is good

  // Mock chart points for SVG
  const points = "0,40 10,35 20,45 30,25 40,30 50,15 60,20 70,10 80,25 90,5 100,20";

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col h-full border border-border/40 shadow-xl group hover:border-domain-money/30 transition-all duration-500 overflow-hidden relative">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-domain-money/10 flex items-center justify-center border border-domain-money/20">
            <Wallet className="w-4 h-4" style={{ color: "var(--domain-money)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Capital</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Resource Allocation</div>
          </div>
        </div>
        <Link 
          href="/expenses" 
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-surface-elevated/80 border border-border/50 transition-colors"
          style={{ color: "var(--domain-money)" }}
        >
          View Ledger
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex items-end gap-3 mb-2">
          <div 
            className="text-3xl font-bold font-display tracking-tight tabular-nums"
            style={{ color: isOverBudget ? "var(--status-danger)" : "var(--foreground)" }}
          >
            ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1 mb-1.5 px-1.5 py-0.5 rounded bg-surface/50 border border-border/30">
            {isTrendGood ? (
              <TrendingDown className="w-3 h-3 text-status-success" />
            ) : (
              <TrendingUp className="w-3 h-3 text-status-danger" />
            )}
            <span className={`text-[10px] font-bold ${isTrendGood ? "text-status-success" : "text-status-danger"}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        </div>
        
        {/* Visual Budget Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
            <span>Burn Rate</span>
            <span>Max: ₹{(budget/1000).toFixed(0)}k</span>
          </div>
          <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden flex">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ 
                width: mounted ? `${Math.min((total / budget) * 100, 100)}%` : '0%',
                backgroundColor: isOverBudget ? "var(--status-danger)" : "var(--domain-money)"
              }} 
            />
          </div>
        </div>

        {/* Bespoke Mini Sparkline Chart */}
        <div className="mt-6 h-12 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-domain-money/10 to-transparent opacity-50" />
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <polyline
              points={points}
              fill="none"
              stroke="var(--domain-money)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_var(--domain-money)] opacity-80"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-muted-foreground/60 font-mono uppercase tracking-widest mt-1">
            <span>W1</span>
            <span>W2</span>
            <span>W3</span>
            <span>W4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
