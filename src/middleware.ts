import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_BROWSERS = /mozilla\/5\.0 .*?(chrome|safari|firefox|edg|opr)/;
const BLOCKED_UA      = /(curl|wget|python|requests|axios|go-http-client|libwww-perl|java\/)/;

export function middleware(request: NextRequest) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // 1️⃣ 白名單
  if (ALLOWED_BROWSERS.test(ua) ||
      /googlebot|bingbot|baiduspider|facebookexternalhit|twitterbot|slackbot|whatsapp|discordbot|linkedinbot/.test(ua)) {
    return NextResponse.next();                 // 符合瀏覽器 / 合法機器人 → 放行
  }

  // 2️⃣ 黑名單
  if (BLOCKED_UA.test(ua)) {
    return new NextResponse(
      "<h1>Access Denied</h1><p>Your browser or tool is not supported.</p>",
      { status: 403, headers: { "Content-Type": "text/html" } }
    );
  }

  // 3️⃣ 其他可疑 UA：允許但不要快取
  const res = NextResponse.next();              // 動態回應
  res.headers.set("x-middleware-cache", "no-cache");
  return res;
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|api/health).*)"],
};
