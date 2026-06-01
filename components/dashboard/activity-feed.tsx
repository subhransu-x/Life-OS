import type { ActivityItemType } from "@/lib/queries/dashboard";
import { Activity } from "lucide-react";

export function ActivityFeed({ items }: { items: ActivityItemType[] }) {
  if (items.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] border border-border/40">
        <Activity className="w-8 h-8 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-semibold text-foreground tracking-widest uppercase">No System Activity</p>
        <p className="text-xs text-muted-foreground/80 mt-2 max-w-[200px] leading-relaxed">Awaiting neural input.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-border/40 shadow-xl">
      <div className="px-6 py-5 border-b border-border/30 bg-surface/30">
        <h3 className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Event Log
        </h3>
      </div>
      <div className="p-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-[33px] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 group cursor-default">
              {/* Timeline Dot */}
              <div className="relative mt-1">
                <div 
                  className="w-3 h-3 rounded-full border-2 bg-surface flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
                  style={{ 
                    borderColor: item.accentColor,
                    boxShadow: `0 0 12px ${item.accentColor}60`
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-surface/40 backdrop-blur-sm border border-border/30 p-3 rounded-xl transition-all duration-300 group-hover:bg-surface/80 group-hover:border-border/60 group-hover:shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
                    style={{
                      color: item.accentColor,
                      backgroundColor: `${item.accentColor}10`,
                      borderColor: `${item.accentColor}30`,
                    }}
                  >
                    {item.domain}
                  </div>
                  <time className="text-[10px] text-muted-foreground/80 font-mono tracking-tighter">
                    {item.timestamp.toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-sm text-foreground/90 font-medium leading-snug">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
