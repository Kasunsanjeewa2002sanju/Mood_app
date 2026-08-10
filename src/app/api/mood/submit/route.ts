import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getMoodConfig } from "@/lib/mood-levels";
import { saveMood } from "@/lib/mood-service";
import { sendNotification } from "@/lib/notifications";
import type { MoodLevel } from "@/lib/types";

const VALID_MOODS: MoodLevel[] = ["terrible", "meh", "okay", "good", "amazing"];

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const mood = body.mood as MoodLevel;

    if (!mood || !VALID_MOODS.includes(mood)) {
      return NextResponse.json({ error: "Invalid mood level" }, { status: 400 });
    }

    const entry = await saveMood(mood, auth.userId);
    const config = getMoodConfig(mood);

    const partnerName = process.env.PARTNER_NAME ?? "She";
    await sendNotification(
      "Mood Update 💭",
      `${partnerName} is feeling ${config.label.toLowerCase()} ${config.emoji} today!`,
      "mood"
    );

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Mood submit error:", error);
    return NextResponse.json({ error: "Failed to save mood" }, { status: 500 });
  }
}
