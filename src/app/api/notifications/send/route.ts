import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { sendNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type } = body;

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "mood" && type !== "hug") {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    const result = await sendNotification(title, message, type);
    return NextResponse.json({ success: result.sent, ...result });
  } catch (error) {
    console.error("Notification send error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
