"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  BookOpen,
  Hammer,
  GraduationCap,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Palette,
  Settings,
  Target,
} from "lucide-react";
import { useThemeStore, type ThemeType } from "@/lib/store/theme-store";
import { LevelProgress } from "@/components/dashboard/level-progress";
import { getProfile } from "@/lib/queries/gamification";

const mainNavItems = [
  {
    name: "Home",
    href: "/",
    icon: LayoutDashboard,
    accentColor: "var(--domain-home)",
  },
  {
    name: "Money",
    href: "/expenses",
    icon: Wallet,
    accentColor: "var(--domain-money)",
  },
  {
    name: "Mind",
    href: "/journal",
    icon: BookOpen,
    accentColor: "var(--domain-mind)",
  },
  {
    name: "Build",
    href: "/habits",
    icon: Hammer,
    accentColor: "var(--domain-build)",
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
    accentColor: "var(--primary)",
  },
  {
    name: "Study",
    href: "/study",
    icon: GraduationCap,
    accentColor: "var(--domain-mind)", // Reusing mind color or creating a new one? Let's use mind for now
  },
];

const futureNavItems = [
  { name: "Body", icon: Dumbbell },
  { name: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  
  const [profile, setProfile] = useState<{level: number, xp: number, currentStreak: number} | null>(null);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    getProfile().then((p) => {
      if (active) setProfile(p);
    });
    return () => {
      active = false;
    };
  }, []);

  const activeTheme = mounted ? theme : "cyber";

  return (
    <aside
      className={`hidden lg:flex flex-col fixed inset-y-4 left-4 z-40 bg-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Brand (Icon Only) */}
      <div className="flex items-center justify-center h-14 border-b border-border/50">
        <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.15)]">
          <svg 
            className="w-5.5 h-5.5 text-primary" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
            <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium spring-transition group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "text-foreground bg-surface-elevated shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/40 border border-transparent"
              }`}
            >
              <div className="relative flex-shrink-0">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                {isActive && (
                  <div
                    className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                )}
              </div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Separator */}
        <div className="pt-4 pb-2">
          <div className="h-px bg-border" />
        </div>

        {/* Future Items */}
        {futureNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/40 cursor-default select-none ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </div>
          );
        })}
      </nav>

      {/* User Status / Streak (Mini Dashboard) */}
      <div className="px-3 pb-3">
        <div className={`flex flex-col rounded-xl bg-surface-elevated/20 border border-border/40 p-3 ${collapsed ? 'items-center' : ''}`}>
          {profile ? (
            <LevelProgress 
              level={profile.level} 
              xp={profile.xp} 
              currentStreak={profile.currentStreak} 
              collapsed={collapsed} 
            />
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-surface-elevated h-10 w-10"></div>
              {!collapsed && (
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-surface-elevated rounded"></div>
                  <div className="h-2 bg-surface-elevated rounded w-5/6"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Theme Switcher */}
      <div className="px-3 py-2 border-t border-border/50">
        {collapsed ? (
          <button
            onClick={() => {
              const next: Record<ThemeType, ThemeType> = {
                cyber: "obsidian",
                obsidian: "light",
                light: "cyber",
              };
              setTheme(next[activeTheme]);
            }}
            className="flex items-center justify-center w-full rounded-lg py-2 text-muted-foreground hover:text-foreground hover:bg-surface-elevated/40 transition-all duration-300"
            title={`Switch Theme (Current: ${activeTheme})`}
          >
            <Palette className="w-5 h-5 text-primary" />
          </button>
        ) : (
          <div className="bg-surface-elevated/40 border border-border/30 rounded-lg p-1 flex flex-col gap-1.5">
            <span className="text-[10px] font-heading font-semibold tracking-wider text-muted-foreground uppercase pl-1.5">
              Theme Mode
            </span>
            <div className="grid grid-cols-3 gap-0.5 bg-surface/50 p-0.5 rounded border border-border/20">
              <button
                onClick={() => setTheme("cyber")}
                className={`py-1 rounded text-[8px] font-heading font-bold tracking-wider transition-all text-center ${
                  activeTheme === "cyber"
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(0,229,255,0.15)]"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                CYB
              </button>
              <button
                onClick={() => setTheme("obsidian")}
                className={`py-1 rounded text-[8px] font-heading font-bold tracking-wider transition-all text-center ${
                  activeTheme === "obsidian"
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                OBS
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`py-1 rounded text-[8px] font-heading font-bold tracking-wider transition-all text-center ${
                  activeTheme === "light"
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(14,165,233,0.15)]"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                LGT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-surface-elevated/40 spring-transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
