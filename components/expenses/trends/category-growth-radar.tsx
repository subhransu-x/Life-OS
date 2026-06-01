"use client";

import { useMemo } from "react";
import { getCategoryGrowth } from "@/lib/utils/trends";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

export function CategoryGrowthRadar({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  const catGrowth = useMemo(() => getCategoryGrowth(expenses, categories), [expenses, categories]);
  
  if (catGrowth.length < 3) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[250px] text-center text-muted-foreground text-sm">
        <p>Not enough category data for radar analysis.</p>
        <p className="text-xs mt-1">Need at least 3 categories with spend.</p>
      </div>
    );
  }
  
  const maxSpent = Math.max(...catGrowth.map(c => Math.max(c.currentSpent, c.lastSpent)), 1);
  const size = 280;
  const center = size / 2;
  const radius = (size / 2) - 40; // padding for labels

  const getPoint = (value: number, index: number, total: number, maxRadius = radius) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / maxSpent) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const currentPoints = catGrowth.map((c, i) => getPoint(c.currentSpent, i, catGrowth.length)).map(p => `${p.x},${p.y}`).join(" ");
  const lastPoints = catGrowth.map((c, i) => getPoint(c.lastSpent, i, catGrowth.length)).map(p => `${p.x},${p.y}`).join(" ");

  // Grid background
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold font-heading">Category Radar</h3>
        <div className="flex gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Current</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> Last Month</div>
        </div>
      </div>
      
      <div className="relative w-full flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid Circles */}
          {gridLevels.map(level => (
            <polygon
              key={level}
              points={catGrowth.map((_, i) => {
                const angle = (Math.PI * 2 * i) / catGrowth.length - Math.PI / 2;
                const r = radius * level;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(" ")}
              fill="none"
              stroke="currentColor"
              className="text-border/50"
              strokeWidth={1}
            />
          ))}

          {/* Axes */}
          {catGrowth.map((_, i) => {
             const angle = (Math.PI * 2 * i) / catGrowth.length - Math.PI / 2;
             return (
               <line 
                 key={`axis-${i}`}
                 x1={center} 
                 y1={center} 
                 x2={center + radius * Math.cos(angle)} 
                 y2={center + radius * Math.sin(angle)}
                 stroke="currentColor"
                 className="text-border/50"
                 strokeWidth={1}
               />
             );
          })}

          {/* Data Polygons */}
          <polygon
            points={lastPoints}
            fill="currentColor"
            fillOpacity={0.1}
            stroke="currentColor"
            strokeWidth={2}
            className="text-muted-foreground"
          />
          <polygon
            points={currentPoints}
            fill="currentColor"
            fillOpacity={0.2}
            stroke="currentColor"
            strokeWidth={2}
            className="text-primary"
          />

          {/* Labels */}
          {catGrowth.map((c, i) => {
            const angle = (Math.PI * 2 * i) / catGrowth.length - Math.PI / 2;
            const r = radius + 20;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            
            // Adjust text anchor based on angle
            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.cos(angle) > 0.1) textAnchor = "start";
            if (Math.cos(angle) < -0.1) textAnchor = "end";

            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-[10px] font-bold uppercase tracking-widest fill-muted-foreground"
              >
                {c.category.name}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
