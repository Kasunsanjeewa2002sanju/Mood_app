import type { MoodLevel } from "./types";

export interface MoodLevelConfig {
  value: MoodLevel;
  emoji: string;
  label: string;
  color: string;
  score: number;
}

export const MOOD_LEVELS: MoodLevelConfig[] = [
  { value: "terrible", emoji: "😢", label: "Terrible", color: "#ef4444", score: 1 },
  { value: "meh", emoji: "😕", label: "Meh", color: "#f97316", score: 2 },
  { value: "okay", emoji: "😐", label: "Okay", color: "#eab308", score: 3 },
  { value: "good", emoji: "😊", label: "Good", color: "#22c55e", score: 4 },
  { value: "amazing", emoji: "🎉", label: "Amazing", color: "#a855f7", score: 5 },
];

export const QUICK_MOODS = [
  { mood: "good" as MoodLevel, emoji: "😊", label: "Good" },
  { mood: "okay" as MoodLevel, emoji: "😐", label: "Okay" },
  { mood: "meh" as MoodLevel, emoji: "😕", label: "Meh" },
  { mood: "amazing" as MoodLevel, emoji: "🎉", label: "Amazing" },
  { mood: "terrible" as MoodLevel, emoji: "😴", label: "Tired" },
];

export function getMoodConfig(mood: MoodLevel): MoodLevelConfig {
  return MOOD_LEVELS.find((m) => m.value === mood) ?? MOOD_LEVELS[2];
}

export function scoreToMood(score: number): MoodLevel {
  const clamped = Math.max(0, Math.min(MOOD_LEVELS.length - 1, Math.round(score)));
  return MOOD_LEVELS[clamped].value;
}
