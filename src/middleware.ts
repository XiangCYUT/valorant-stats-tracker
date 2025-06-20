// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// UA 白名單
const UA_WHITELIST = [
  /Googlebot/i,
  /bingbot/i,
  /BaiduSpider/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /Slackbot/i,
  /WhatsApp/i,
  /Discordbot/i,
  /LinkedInBot/i,
  /Mozilla\/\d+/i, // 大多數瀏覽器
];

// UA 黑名單
const UA_BLOCKLIST = [
  /curl/i,
  /wget/i,
  /python/i,
  /requests/i,
  /axios/i,
  /go-http-client/i,
  /libwww-perl/i,
  /Java\//i,
];

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const res403 = new NextResponse(
    JSON.stringify({ error: "Forbidden" }, null, 2),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
  res403.headers.set("x-middleware-cache", "no-cache");

  // 白名單
  if (UA_WHITELIST.some((r) => r.test(ua))) return NextResponse.next();

  // 黑名單
  if (UA_BLOCKLIST.some((r) => r.test(ua))) return res403;

  // 已通過 reCAPTCHA
  if (req.cookies.get("recaptcha_ok")?.value === "1") return NextResponse.next();

  // 其他 UA：導向驗證頁
  const url = req.nextUrl.clone();
  url.pathname = "/recaptcha";
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);

  const redirect = NextResponse.redirect(url, 302);
  redirect.headers.set("x-middleware-cache", "no-cache");
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|api/recaptcha-verify|recaptcha).*)",
  ],
};