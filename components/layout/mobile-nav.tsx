"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, BookOpen, Hammer } from "lucide-react";

const navItems = [
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
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] rounded-lg transition-all duration-150 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground active:scale-95"
              }`}
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5"
                  style={isActive ? { color: item.accentColor } : undefined}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={isActive ? { color: item.accentColor } : undefined}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
