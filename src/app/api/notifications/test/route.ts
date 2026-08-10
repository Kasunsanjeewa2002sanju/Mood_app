import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { isTelegramConfigured, sendTestTelegram } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isTelegramConfigured()) {
      return NextResponse.json(
        {
          error: "Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local",
          configured: false,
        },
        { status: 400 }
      );
    }

    const result = await sendTestTelegram();
    if (!result.sent) {
      return NextResponse.json(
        { error: result.error ?? "Test message failed", configured: true },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test message sent to Telegram",
      provider: "telegram",
    });
  } catch (error) {
    console.error("Telegram test error:", error);
    return NextResponse.json({ error: "Failed to send test message" }, { status: 500 });
  }
}
