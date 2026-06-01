"use server";

import { db } from "@/lib/db";

export async function getMomentumHistory() {
  const history = await db.lifeScoreLog.findMany({
    orderBy: { date: 'asc' },
    take: 30
  });
  
  return history;
}

export async function getHeatmapData() {
  // We want an array of objects representing days over the last year
  // { date: string, count: number }
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const habitLogs = await db.habitLog.findMany({
    where: {
      completedAt: { gte: oneYearAgo }
    },
    select: { completedAt: true }
  });
  
  // Aggregate by date string (YYYY-MM-DD)
  const counts: Record<string, number> = {};
  
  habitLogs.forEach(log => {
    const d = new Date(log.completedAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[dateStr] = (counts[dateStr] || 0) + 1;
  });
  
  const heatmapData = [];
  const current = new Date(oneYearAgo);
  
  while (current <= today) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    heatmapData.push({
      date: dateStr,
      count: counts[dateStr] || 0
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return heatmapData;
}
