import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getLatestMood } from "@/lib/mood-service";

export async function GET(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entry = await getLatestMood(auth.userId);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Mood latest error:", error);
    return NextResponse.json({ error: "Failed to fetch mood" }, { status: 500 });
  }
}
