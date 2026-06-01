import Link from "next/link";
import { Wallet, BookOpen, Hammer, Target, GraduationCap } from "lucide-react";

export function QuickNavigation() {
  const links = [
    {
      name: "Log Expense",
      href: "/expenses",
      icon: Wallet,
      accentColor: "var(--domain-money)",
      glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    },
    {
      name: "New Journal",
      href: "/journal",
      icon: BookOpen,
      accentColor: "var(--domain-mind)",
      glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    },
    {
      name: "Track Habit",
      href: "/habits",
      icon: Hammer,
      accentColor: "var(--domain-build)",
      glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    },
    {
      name: "Create Goal",
      href: "/goals",
      icon: Target,
      accentColor: "var(--primary)",
      glowClass: "shadow-[0_0_15px_rgba(0,229,255,0.15)] group-hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]",
    },
    {
      name: "Start Study",
      href: "/study",
      icon: GraduationCap,
      accentColor: "var(--text-primary)",
      glowClass: "shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]",
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass-card border border-border/40 spring-transition hover:-translate-y-1 active:scale-95 overflow-hidden ${link.glowClass}`}
          >
            {/* Ambient Background Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ backgroundColor: link.accentColor }}
            />
            
            <div className="relative z-10 p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-border/50 group-hover:scale-110 spring-transition">
              <Icon className="w-5 h-5 flex-shrink-0 transition-colors" style={{ color: link.accentColor }} />
            </div>
            
            <span className="relative z-10 text-xs font-semibold text-foreground/90 tracking-wider uppercase text-center group-hover:text-foreground transition-colors">
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
