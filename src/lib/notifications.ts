import { kvGet, kvSet, KV_KEYS } from "./kv";
import type { NotificationPreferences } from "./types";

const DEFAULT_PREFS: NotificationPreferences = {
  moodEnabled: true,
  hugEnabled: true,
};

async function getPreferences(): Promise<NotificationPreferences> {
  return (await kvGet<NotificationPreferences>(KV_KEYS.notificationPrefs())) ?? DEFAULT_PREFS;
}

async function sendPushover(title: string, message: string): Promise<boolean> {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;
  if (!userKey || !appToken) return false;

  const response = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: appToken,
      user: userKey,
      title,
      message,
      priority: 0,
    }),
  });

  return response.ok;
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

async function sendTelegram(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Telegram API error:", error);
  }

  return response.ok;
}

export async function sendTestTelegram(): Promise<{ sent: boolean; error?: string }> {
  if (!isTelegramConfigured()) {
    return { sent: false, error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing" };
  }

  const sent = await sendWithRetry(() =>
    sendTelegram(
      "<b>The Mood Bridge</b>\nTelegram is connected! You will receive hug and mood notifications here. 💕"
    )
  );

  return sent ? { sent: true } : { sent: false, error: "Telegram API rejected the message" };
}

async function sendWithRetry(
  sendFn: () => Promise<boolean>,
  retries = 3
): Promise<boolean> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const success = await sendFn();
      if (success) return true;
    } catch (error) {
      console.error(`Notification attempt ${attempt + 1} failed:`, error);
    }
    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 500));
    }
  }
  return false;
}

export async function sendNotification(
  title: string,
  message: string,
  type: "mood" | "hug"
): Promise<{ sent: boolean; provider?: string }> {
  const prefs = await getPreferences();
  if (type === "mood" && !prefs.moodEnabled) return { sent: false };
  if (type === "hug" && !prefs.hugEnabled) return { sent: false };

  const fullMessage = `${message}\n${new Date().toLocaleString()}`;

  if (isTelegramConfigured()) {
    const sent = await sendWithRetry(() => sendTelegram(`<b>${title}</b>\n${fullMessage}`));
    if (sent) return { sent: true, provider: "telegram" };
    console.error("[Telegram] Message failed — check TELEGRAM_CHAT_ID (run: node scripts/telegram-setup.mjs)");
  } else {
    console.warn("[Telegram] Not configured — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local");
  }

  if (process.env.PUSHOVER_USER_KEY && process.env.PUSHOVER_APP_TOKEN) {
    const sent = await sendWithRetry(() => sendPushover(title, fullMessage));
    if (sent) return { sent: true, provider: "pushover" };
  }

  console.log(`[Notification fallback] ${title}: ${fullMessage}`);
  return { sent: false, provider: "none" };
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const current = await getPreferences();
  const updated = { ...current, ...prefs };
  await kvSet(KV_KEYS.notificationPrefs(), updated);
  return updated;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return getPreferences();
}
