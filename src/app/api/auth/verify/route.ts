import { NextResponse } from "next/server";
import {
  createSession,
  getClientIp,
  SESSION_COOKIE,
  verifyPin,
} from "@/lib/auth";
import { checkPinRateLimit, recordPinAttempt } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkPinRateLimit(ip);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
 
    const body = await request.json();
    const pin = body.pin as string;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    if (!verifyPin(pin)) {
      await recordPinAttempt(ip, false);
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    await recordPinAttempt(ip, true);
    const sessionId = await createSession();

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
