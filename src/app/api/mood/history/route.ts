import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getMoodHistory } from "@/lib/mood-service";

export async function GET(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const days = searchParams.get("days");
    const since = days ? Date.now() - parseInt(days, 10) * 24 * 60 * 60 * 1000 : undefined;

    const entries = await getMoodHistory(auth.userId, limit, since);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Mood history error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
