import Link from "next/link";
import { BookOpen, Smile, Meh, Frown, PenTool } from "lucide-react";

type JournalSummaryProps = {
  total: number;
  recent: Array<{
    id: string;
    content: string;
    createdAt: Date;
  }>;
};

export function JournalSummary({ total, recent }: JournalSummaryProps) {
  // Mock data for new UI
  const wordCount = 12450;
  const writingStreak = 5;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col h-full border border-border/40 shadow-xl group hover:border-domain-mind/30 transition-all duration-500 overflow-hidden relative">
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-domain-mind/10 flex items-center justify-center border border-domain-mind/20">
            <BookOpen className="w-4 h-4" style={{ color: "var(--domain-mind)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Mind</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Cognitive State</div>
          </div>
        </div>
        <Link 
          href="/journal" 
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-surface-elevated/80 border border-border/50 transition-colors"
          style={{ color: "var(--domain-mind)" }}
        >
          Write Entry
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <PenTool className="w-6 h-6 text-muted-foreground/50 mb-2" />
          <p className="text-sm font-medium text-foreground">No neural logs found.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          {recent.slice(0, 1).map((entry) => (
            <div key={entry.id} className="relative p-4 rounded-2xl bg-surface/40 border border-border/30 group-hover:bg-surface-elevated/40 transition-colors">
              <div className="absolute top-0 left-4 w-[1px] h-full bg-domain-mind/20" />
              <div className="absolute top-5 left-[13px] w-2 h-2 rounded-full bg-domain-mind shadow-[0_0_8px_var(--domain-mind)]" />
              <div className="pl-5 text-xs">
                <div className="text-muted-foreground/70 mb-1 font-mono uppercase tracking-wider text-[9px]">
                  {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
                <div className="text-foreground/90 line-clamp-3 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                  {`"${entry.content}"`}
                </div>
              </div>
            </div>
          ))}
          
          {/* Mood Timeline Mock */}
          <div className="mt-2">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Mood Telemetry (7d)</div>
            <div className="flex items-center justify-between bg-surface/30 px-3 py-2 rounded-xl border border-border/20">
              <Smile className="w-4 h-4 text-status-success shadow-[0_0_8px_var(--status-success)]" />
              <div className="h-px w-2 bg-border/50" />
              <Meh className="w-4 h-4 text-muted-foreground" />
              <div className="h-px w-2 bg-border/50" />
              <Smile className="w-4 h-4 text-status-success shadow-[0_0_8px_var(--status-success)]" />
              <div className="h-px w-2 bg-border/50" />
              <Frown className="w-4 h-4 text-status-danger shadow-[0_0_8px_var(--status-danger)]" />
              <div className="h-px w-2 bg-border/50" />
              <Smile className="w-4 h-4 text-status-success shadow-[0_0_8px_var(--status-success)]" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status */}
      <div className="mt-6 pt-4 border-t border-border/30 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-mono">{total} Logs</span>
          <span className="text-border/50">•</span>
          <span className="text-xs text-muted-foreground font-mono">{wordCount.toLocaleString()} Words</span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-domain-mind/10 px-2 py-1 rounded border border-domain-mind/20">
          <PenTool className="w-3.5 h-3.5" style={{ color: "var(--domain-mind)" }} />
          <span className="text-[10px] font-bold tracking-wider uppercase tabular-nums" style={{ color: "var(--domain-mind)" }}>{writingStreak}d Streak</span>
        </div>
      </div>
    </div>
  );
}
