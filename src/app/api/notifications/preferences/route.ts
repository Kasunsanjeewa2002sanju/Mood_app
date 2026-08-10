import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await getNotificationPreferences();
    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("Notification prefs error:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const prefs = await updateNotificationPreferences(body);
    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("Notification prefs update error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
