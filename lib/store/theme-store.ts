"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "cyber" | "obsidian" | "light";

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "cyber",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "life-os-theme-storage",
    }
  )
);
