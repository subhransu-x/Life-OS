import {
  getDashboardHabitSummary,
  getDashboardExpenseSummary,
  getDashboardJournalSummary,
  getLifeScore,
  getRecentActivity,
  getStreakData,
  getWeeklyLifeScoreChange,
  getConsistencyScore
} from "@/lib/queries/dashboard";
import { getMissions, getAchievements } from "@/lib/queries/gamification";
import { getMomentumHistory, getHeatmapData } from "@/lib/queries/analytics";
import { QuickNavigation } from "@/components/dashboard/quick-navigation";
import { HabitSummary } from "@/components/dashboard/habit-summary";
import { ExpenseSummary } from "@/components/dashboard/expense-summary";
import { JournalSummary } from "@/components/dashboard/journal-summary";
import { LifeScoreRing } from "@/components/dashboard/life-score-ring";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MissionBoard } from "@/components/dashboard/mission-board";
import { MomentumGraph } from "@/components/dashboard/momentum-graph";
import { GithubHeatmap } from "@/components/dashboard/github-heatmap";
import { AchievementsPanel } from "@/components/dashboard/achievements-panel";
import { WeeklyReview } from "@/components/dashboard/weekly-review";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    habitSummary, 
    expenseSummary, 
    journalSummary, 
    lifeScore, 
    recentActivity,
    missions,
    achievements,
    momentumHistory,
    heatmapData,
    streakData,
    weeklyChange,
    consistencyScore
  ] = await Promise.all([
    getDashboardHabitSummary(),
    getDashboardExpenseSummary(),
    getDashboardJournalSummary(),
    getLifeScore(),
    getRecentActivity(),
    getMissions(),
    getAchievements(),
    getMomentumHistory(),
    getHeatmapData(),
    getStreakData(),
    getWeeklyLifeScoreChange(),
    getConsistencyScore()
  ]);

  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const weeklyChangeDisplay = weeklyChange >= 0 ? `+${weeklyChange}%` : `${weeklyChange}%`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      {/* Cinematic Command Center Hero */}
      <section className="relative flex flex-col xl:flex-row gap-6 mb-8">
        
        {/* Main Status Panel */}
        <div className="relative flex-1 glass-card rounded-3xl p-8 lg:p-10 overflow-hidden border border-border/40 shadow-2xl flex flex-col justify-between min-h-[360px] spring-transition hover:border-primary/30">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated/50 border border-border/50 text-[10px] font-bold tracking-widest text-primary uppercase mb-6 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              System Online
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-display uppercase mb-2 drop-shadow-[0_0_25px_rgba(0,229,255,0.3)]">
              {greeting},<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-secondary">Subhransu</span>.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed mt-4">
              Neural sync complete. All primary systems nominal. You have completed {habitSummary.completed} objectives and utilized ₹{expenseSummary.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })} in resources.
            </p>
          </div>

          {/* Active Directives */}
          <div className="relative z-10 mt-8 pt-6 border-t border-border/30">
            <MissionBoard missions={missions} />
          </div>
        </div>

        {/* Life Score Core Reactor Container */}
        <div className="relative w-full xl:w-[400px] shrink-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center border border-border/40 shadow-2xl overflow-hidden min-h-[360px] group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-700" />
          
          <div className="text-center mb-6 relative z-10">
            <div className="text-[10px] font-bold tracking-widest text-primary uppercase mb-1">Core Synchronization</div>
            <div className="text-sm text-foreground/80 font-medium">Life Score Metrics</div>
          </div>
          
          <div className="relative z-10 flex-1 flex items-center justify-center w-full">
            <LifeScoreRing score={lifeScore} />
          </div>
          
          <div className="flex w-full justify-between mt-6 relative z-10 px-2">
            <div className="text-center bg-surface/30 px-4 py-2 rounded-lg border border-border/30">
              <div className="text-[9px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Weekly</div>
              <div className={`text-xs font-bold ${weeklyChange >= 0 ? 'text-status-success' : 'text-status-danger'}`}>{weeklyChangeDisplay}</div>
            </div>
            <div className="text-center bg-surface/30 px-4 py-2 rounded-lg border border-border/30">
              <div className="text-[9px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Streak</div>
              <div className="text-xs font-bold text-accent-secondary">{streakData.currentStreak} Days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <QuickNavigation />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Column: Summaries */}
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-medium text-foreground mb-4">Today&apos;s Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HabitSummary {...habitSummary} currentStreak={streakData.currentStreak} consistencyScore={consistencyScore} />
              <ExpenseSummary {...expenseSummary} />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground mb-4">Mind</h2>
            <JournalSummary {...journalSummary} />
          </section>

          <section>
            <GithubHeatmap data={heatmapData} />
          </section>

          <section>
            <AchievementsPanel achievements={achievements} />
          </section>
        </div>

        {/* Right Column: Analytics & Activity */}
        <aside>
          <div className="space-y-8">
            <WeeklyReview stats={{
              habitsCompleted: habitSummary.completed,
              habitTotal: habitSummary.total,
              journalEntries: journalSummary.total,
              expensesTotal: expenseSummary.total,
              budgetLimit: 25000
            }} />
            <MomentumGraph data={momentumHistory} />
            <ActivityFeed items={recentActivity} />
          </div>
        </aside>
      </div>
    </div>
  );
}
