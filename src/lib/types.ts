export type MoodLevel =
  | "terrible"
  | "meh"
  | "okay"
  | "good"
  | "amazing";

export interface MoodEntry {
  mood: MoodLevel;
  emoji: string;
  label: string;
  date: string;
  timestamp: number;
  userId: string;
}

export interface SessionData {
  userId: string;
  expiresAt: number;
}

export interface NotificationPreferences {
  moodEnabled: boolean;
  hugEnabled: boolean;
}

export interface MoodSummary {
  total: number;
  byLevel: Record<MoodLevel, number>;
  weekLabel: string;
  goodDays: number;
  okayDays: number;
  lowDays: number;
}

export interface ApiError {
  error: string;
  code?: string;
}
