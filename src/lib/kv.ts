import { kv } from "@vercel/kv";

const memoryStore = new Map<string, unknown>();

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (isKvConfigured()) {
    return (await kv.get<T>(key)) ?? null;
  }
  return (memoryStore.get(key) as T) ?? null;
}

export async function kvSet(
  key: string,
  value: unknown,
  options?: { ex?: number }
): Promise<void> {
  if (isKvConfigured()) {
    if (options?.ex) {
      await kv.set(key, value, { ex: options.ex });
    } else {
      await kv.set(key, value);
    }
    return;
  }

  memoryStore.set(key, value);
  if (options?.ex) {
    setTimeout(() => memoryStore.delete(key), options.ex * 1000);
  }
}

export async function kvDel(key: string): Promise<void> {
  if (isKvConfigured()) {
    await kv.del(key);
    return;
  }
  memoryStore.delete(key);
}

export async function kvKeys(pattern: string): Promise<string[]> {
  if (isKvConfigured()) {
    const keys: string[] = [];
    let cursor = 0;
    do {
      const [nextCursor, batch] = await kv.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(nextCursor);
      keys.push(...batch);
    } while (cursor !== 0);
    return keys;
  }

  const prefix = pattern.replace("*", "");
  return [...memoryStore.keys()].filter((k) => k.startsWith(prefix));
}

export const KV_KEYS = {
  mood: (userId: string, timestamp: number) => `mood:${userId}:${timestamp}`,
  moodLatest: (userId: string) => `mood:latest:${userId}`,
  hugCooldown: (userId: string) => `hug:cooldown:${userId}`,
  pinAttempts: (ip: string) => `pin:attempts:${ip}`,
  session: (sessionId: string) => `session:${sessionId}`,
  notificationPrefs: () => "notifications:prefs",
} as const;
