import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { kvGet, kvSet, KV_KEYS } from "@/lib/kv";
import { sendNotification } from "@/lib/notifications";

const HUG_COOLDOWN_MS = 60 * 1000;

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cooldownKey = KV_KEYS.hugCooldown(auth.userId);
    const cooldown = await kvGet<{ lastHug: number }>(cooldownKey);

    if (cooldown && Date.now() - cooldown.lastHug < HUG_COOLDOWN_MS) {
      const remaining = Math.ceil(
        (HUG_COOLDOWN_MS - (Date.now() - cooldown.lastHug)) / 1000
      );
      return NextResponse.json(
        { error: `Please wait ${remaining}s before sending another hug`, code: "COOLDOWN" },
        { status: 429 }
      );
    }

    await kvSet(cooldownKey, { lastHug: Date.now() }, { ex: 60 });

    const result = await sendNotification(
      "Digital Hug 💕",
      "She sent you a hug! 💕",
      "hug"
    );

    return NextResponse.json({
      success: true,
      notification: result,
      timestamp: new Date().toISOString(),
      telegramConfigured: Boolean(
        process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
      ),
    });
  } catch (error) {
    console.error("Hug send error:", error);
    return NextResponse.json({ error: "Failed to send hug" }, { status: 500 });
  }
}
