"use client";

import { LineChart } from "lucide-react";
import { useEffect, useState } from "react";

type MomentumData = {
  date: Date;
  score: number;
};

export function MomentumGraph({ data }: { data: MomentumData[] }) {
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

  if (!data || data.length === 0) return null;

  // Normalize data for SVG viewBox (0 0 100 50)
  const minScore = Math.min(...data.map(d => d.score)) - 5;
  const maxScore = Math.max(...data.map(d => d.score)) + 5;
  const range = maxScore - minScore;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 50 - ((d.score - minScore) / range) * 50;
    return `${x},${y}`;
  }).join(" ");

  const latestScore = data[data.length - 1].score;
  const previousScore = data[data.length - 2]?.score || latestScore;
  const trend = latestScore - previousScore;

  return (
    <div className="glass-card rounded-3xl p-6 border border-border/40 shadow-xl overflow-hidden relative group">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-domain-mind/10 flex items-center justify-center border border-domain-mind/20">
            <LineChart className="w-4 h-4 text-domain-mind" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Momentum Vector</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">30-Day Life Score Trajectory</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-display tabular-nums leading-none">
            {latestScore.toFixed(1)}
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${trend >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)} Today
          </div>
        </div>
      </div>

      <div className="mt-8 h-32 w-full relative">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full h-px bg-border border-dashed" />
          <div className="w-full h-px bg-border border-dashed" />
          <div className="w-full h-px bg-border border-dashed" />
          <div className="w-full h-px bg-border border-dashed" />
        </div>
        
        {/* Graph Area */}
        <div className="absolute inset-0 bg-gradient-to-t from-domain-mind/10 to-transparent opacity-50" />
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="var(--domain-mind)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_var(--domain-mind)] opacity-90 transition-all duration-1000"
            style={{
              strokeDasharray: mounted ? 'none' : '1000',
              strokeDashoffset: mounted ? '0' : '1000'
            }}
          />
          {/* Latest Point Glow */}
          {mounted && data.length > 0 && (
            <circle 
              cx="100" 
              cy={50 - ((latestScore - minScore) / range) * 50} 
              r="2" 
              fill="var(--domain-mind)"
              className="drop-shadow-[0_0_8px_var(--domain-mind)] animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
