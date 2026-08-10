import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getMoodSummary } from "@/lib/mood-service";

export async function GET(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") ?? "7", 10);

    const summary = await getMoodSummary(auth.userId, days);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Stats summary error:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
