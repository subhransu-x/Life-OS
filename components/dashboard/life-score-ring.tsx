"use client";

import { useEffect, useState } from "react";

export function LifeScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Spring animation effect
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let color = "var(--status-danger)";
  let glowColor = "rgba(239, 68, 68, 0.4)";
  if (score >= 50) {
    color = "var(--status-warning)";
    glowColor = "rgba(245, 158, 11, 0.4)";
  }
  if (score >= 80) {
    color = "var(--primary)"; // Cyan for high score in this theme
    glowColor = "rgba(0, 229, 255, 0.4)";
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[20px] transition-colors duration-1000"
        style={{ backgroundColor: glowColor, opacity: 0.4 }}
      />
      
      {/* Background track */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Outer dashed spinning ring */}
        <circle
          cx={size/2}
          cy={size/2}
          r={radius + 12}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="transparent"
          strokeDasharray="4 8"
          className="text-primary/30 origin-center animate-[spin_20s_linear_infinite]"
        />
        
        {/* Inner track */}
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-surface-elevated"
        />
        
        {/* Animated Score Ring */}
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ 
            color,
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />
      </svg>

      {/* Core Center */}
      <div className="absolute inset-3 rounded-full bg-surface/80 backdrop-blur-md border border-border/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
        <span 
          className="text-5xl font-bold font-display tabular-nums tracking-tighter"
          style={{ 
            color,
            textShadow: `0 0 15px ${glowColor}`
          }}
        >
          {animatedScore.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
