import { kvGet, kvSet, KV_KEYS } from "./kv";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

interface AttemptRecord {
  count: number;
  resetAt: number;
}

export async function checkPinRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const key = KV_KEYS.pinAttempts(ip);
  const now = Date.now();
  const record = await kvGet<AttemptRecord>(key);

  if (!record || record.resetAt < now) {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetAt: now + WINDOW_SECONDS * 1000 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    resetAt: record.resetAt,
  };
}

export async function recordPinAttempt(ip: string, success: boolean): Promise<void> {
  const key = KV_KEYS.pinAttempts(ip);
  const now = Date.now();
  const record = await kvGet<AttemptRecord>(key);

  if (success) {
    await kvSet(key, { count: 0, resetAt: now + WINDOW_SECONDS * 1000 }, { ex: WINDOW_SECONDS });
    return;
  }

  if (!record || record.resetAt < now) {
    await kvSet(
      key,
      { count: 1, resetAt: now + WINDOW_SECONDS * 1000 },
      { ex: WINDOW_SECONDS }
    );
    return;
  }

  await kvSet(
    key,
    { count: record.count + 1, resetAt: record.resetAt },
    { ex: Math.ceil((record.resetAt - now) / 1000) }
  );
}
