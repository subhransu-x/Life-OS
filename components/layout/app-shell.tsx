"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useThemeStore } from "@/lib/store/theme-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useThemeStore();
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

  const activeTheme = mounted ? theme : "cyber";

  useEffect(() => {
    if (!mounted) return;
    
    // Clean up classes
    document.documentElement.classList.remove("theme-cyber", "theme-obsidian", "theme-light", "dark");
    
    // Add current theme class
    const themeClass = activeTheme === "obsidian" ? "theme-obsidian" : activeTheme === "light" ? "theme-light" : "theme-cyber";
    document.documentElement.classList.add(themeClass);
    
    // Add dark class for dark themes
    if (activeTheme !== "light") {
      document.documentElement.classList.add("dark");
    }
  }, [activeTheme, mounted]);

  return (
    <div className={`relative min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-500 ${
      activeTheme === "obsidian" ? "theme-obsidian" : activeTheme === "light" ? "theme-light" : "theme-cyber"
    }`}>
      {/* Full-screen cyber background image */}
      <div 
        className={`fixed inset-0 z-0 pointer-events-none transition-all duration-700 ease-in-out ${
          activeTheme === "light" ? "opacity-35 mix-blend-normal" : "opacity-25 mix-blend-screen"
        }`}
        style={{
          backgroundImage: activeTheme === "obsidian" 
            ? "url('/obsidian-bg.png')" 
            : activeTheme === "light"
              ? "url('/light-bg.png')"
              : "url('/cyber-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: activeTheme === "obsidian" 
            ? "contrast(1.2) brightness(0.7) grayscale(0.2)" 
            : activeTheme === "light"
              ? "contrast(1.05) brightness(1.02)"
              : "contrast(1.1) brightness(0.8)",
        }}
      />
      
      {/* Ambient futuristic HUD radial overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          background: activeTheme === "obsidian"
            ? "radial-gradient(circle at center, rgba(245, 158, 11, 0.01) 0%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0.98) 100%)"
            : activeTheme === "light"
              ? "radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.85) 60%, rgba(248, 250, 252, 0.98) 100%)"
              : "radial-gradient(circle at center, rgba(0, 229, 255, 0.03) 0%, rgba(2, 6, 17, 0.7) 70%, rgba(2, 6, 17, 0.95) 100%)",
        }}
      />

      {/* Distant Stars / Cosmic Particles */}
      {activeTheme !== "light" && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.5), rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px"
          }}
        />
      )}
      
      {/* Soft Cosmic Fog */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-screen transition-all duration-700"
        style={{
          background: activeTheme === "cyber" 
            ? "radial-gradient(circle at 15% 20%, rgba(0, 229, 255, 0.5), transparent 50%), radial-gradient(circle at 85% 80%, rgba(168, 85, 247, 0.4), transparent 50%)"
            : activeTheme === "obsidian"
              ? "radial-gradient(circle at 15% 20%, rgba(245, 158, 11, 0.3), transparent 50%), radial-gradient(circle at 85% 80%, rgba(239, 68, 68, 0.2), transparent 50%)"
              : "none",
          filter: "blur(60px)"
        }}
      />

      {/* Cyberpunk subtle grid texture layer */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: activeTheme === "obsidian"
            ? "linear-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.25) 1px, transparent 1px)"
            : activeTheme === "light"
              ? "linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 229, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft scanlines effect for HUD immersion */}
      <div 
        className={`fixed inset-0 z-0 pointer-events-none transition-all duration-700 ease-in-out ${
          activeTheme === "light" ? "opacity-[0.01]" : "opacity-[0.07]"
        }`}
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <MobileNav />

        <main className={`relative z-10 flex-1 pb-20 lg:pb-0 lg:pt-4 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-[100px]" : "lg:pl-[272px]"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}

