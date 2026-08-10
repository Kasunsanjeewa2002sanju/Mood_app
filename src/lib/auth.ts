import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { kvDel, kvGet, kvSet, KV_KEYS } from "./kv";
import type { SessionData } from "./types";

export const SESSION_COOKIE = "mood_bridge_session";
export const PIN_HEADER = "x-app-pin";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export function hashPin(pin: string): string {
  const secret = process.env.PIN_SALT ?? "mood-bridge-salt";
  return createHash("sha256").update(`${pin}:${secret}`).digest("hex");
}

export function verifyPin(pin: string): boolean {
  const expected = process.env.APP_PIN_HASH ?? hashPin(process.env.APP_PIN ?? "1234");
  return hashPin(pin) === expected;
}

export async function createSession(userId = "partner"): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const session: SessionData = { userId, expiresAt };
  await kvSet(KV_KEYS.session(sessionId), session, { ex: SESSION_TTL_SECONDS });
  return sessionId;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const session = await kvGet<SessionData>(KV_KEYS.session(sessionId));
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    await kvDel(KV_KEYS.session(sessionId));
    return null;
  }
  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await kvDel(KV_KEYS.session(sessionId));
}

export async function validateAuth(
  pinHeader?: string | null,
  sessionId?: string | null
): Promise<{ authorized: boolean; userId: string }> {
  if (sessionId) {
    const session = await getSession(sessionId);
    if (session) {
      return { authorized: true, userId: session.userId };
    }
  }

  if (pinHeader && verifyPin(pinHeader)) {
    return { authorized: true, userId: "partner" };
  }

  return { authorized: false, userId: "" };
}

export async function getAuthFromRequest(request: Request): Promise<{
  authorized: boolean;
  userId: string;
}> {
  const pinHeader = request.headers.get(PIN_HEADER);
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  return validateAuth(pinHeader, sessionId);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
