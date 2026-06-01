import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl border border-dashed border-border/80 bg-surface/30 backdrop-blur-sm group transition-all duration-300 hover:border-border/100">
      {/* Decorative background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
      
      {Icon && (
        <div className="relative w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center mb-5 text-muted-foreground border border-border/50 shadow-inner group-hover:scale-110 group-hover:text-foreground transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-primary/5 -z-10 group-hover:scale-125 duration-1000" />
          <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground tracking-tight font-display">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed font-sans">
        {description}
      </p>
      {action && <div className="mt-6 z-10">{action}</div>}
    </div>
  );
}
