import { getMoodConfig } from "./mood-levels";
import { kvGet, kvKeys, kvSet, KV_KEYS } from "./kv";
import type { MoodEntry, MoodLevel, MoodSummary } from "./types";

const PARTNER_ID = "partner";

export async function saveMood(mood: MoodLevel, userId = PARTNER_ID): Promise<MoodEntry> {
  const config = getMoodConfig(mood);
  const timestamp = Date.now();
  const entry: MoodEntry = {
    mood,
    emoji: config.emoji,
    label: config.label,
    date: new Date(timestamp).toISOString(),
    timestamp,
    userId,
  };

  await kvSet(KV_KEYS.mood(userId, timestamp), entry);
  await kvSet(KV_KEYS.moodLatest(userId), entry);
  return entry;
}

export async function getLatestMood(userId = PARTNER_ID): Promise<MoodEntry | null> {
  return kvGet<MoodEntry>(KV_KEYS.moodLatest(userId));
}

export async function getMoodHistory(
  userId = PARTNER_ID,
  limit = 50,
  since?: number
): Promise<MoodEntry[]> {
  const keys = await kvKeys(`mood:${userId}:*`);
  const moodKeys = keys.filter((k) => !k.includes(":latest:"));

  const entries: MoodEntry[] = [];
  for (const key of moodKeys) {
    const entry = await kvGet<MoodEntry>(key);
    if (entry && (!since || entry.timestamp >= since)) {
      entries.push(entry);
    }
  }

  return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

export async function getMoodSummary(
  userId = PARTNER_ID,
  days = 7
): Promise<MoodSummary> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const entries = await getMoodHistory(userId, 365, since);

  const byLevel: Record<MoodLevel, number> = {
    terrible: 0,
    meh: 0,
    okay: 0,
    good: 0,
    amazing: 0,
  };

  for (const entry of entries) {
    byLevel[entry.mood]++;
  }

  const goodDays = byLevel.good + byLevel.amazing;
  const okayDays = byLevel.okay;
  const lowDays = byLevel.meh + byLevel.terrible;

  return {
    total: entries.length,
    byLevel,
    weekLabel: `This week: ${goodDays} good, ${okayDays} okay, ${lowDays} low`,
    goodDays,
    okayDays,
    lowDays,
  };
}
