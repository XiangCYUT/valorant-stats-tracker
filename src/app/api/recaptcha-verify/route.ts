// app/api/recaptcha-verify/route.ts
import { NextResponse, NextRequest } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { token } = (await req.json()) as { token: string };
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const secret = process.env.RECAPTCHA_SECRET;
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secret ?? "",
          response: token,
        }),
      }
    );
    const data: {
      success: boolean;
      score: number;
      action: string;
    } = await verifyRes.json();
    

    if (data.success && data.action === "access" && data.score >= 0.5) {
      const res = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
      res.headers.append(
        "Set-Cookie",
        `recaptcha_ok=1; Max-Age=7200; Path=/; HttpOnly; Secure; SameSite=Lax`
      );
      return res;
    }
    return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}