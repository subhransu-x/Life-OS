"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Initial XP thresholds for levels
// Lvl 1: 0, Lvl 2: 100, Lvl 3: 250, Lvl 4: 500, etc.
const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  return Math.floor(Math.sqrt(xp / 100)) + 1; // Generic formula for higher levels
};

export async function getProfile() {
  let profile = await db.profile.findFirst();
  
  if (!profile) {
    profile = await db.profile.create({
      data: {
        level: 1,
        xp: 0,
        currentStreak: 0,
        longestStreak: 0,
        lifeScore: 50.0,
      }
    });
  }
  
  return profile;
}

export async function addXP(amount: number) {
  const profile = await getProfile();
  const newXp = profile.xp + amount;
  const newLevel = calculateLevel(newXp);
  
  await db.profile.update({
    where: { id: profile.id },
    data: { 
      xp: newXp,
      level: newLevel
    }
  });
  
  revalidatePath("/");
  return { newXp, newLevel, leveledUp: newLevel > profile.level };
}

export async function getAchievements() {
  const achievements = await db.achievement.findMany();
  const userAchievements = await db.userAchievement.findMany({
    include: { achievement: true }
  });
  
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  
  return achievements.map(a => ({
    ...a,
    unlocked: unlockedIds.has(a.id)
  }));
}

export async function getMissions() {
  const missions = await db.mission.findMany();
  const logs = await db.missionLog.findMany({
    where: {
      completedAt: {
        gte: new Date(new Date().setHours(0,0,0,0))
      }
    }
  });
  
  const completedMissionIds = new Set(logs.map(l => l.missionId));
  
  return missions.map(m => ({
    ...m,
    completed: completedMissionIds.has(m.id)
  }));
}
