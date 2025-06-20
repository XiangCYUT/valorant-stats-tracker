import { NextResponse, type NextRequest } from "next/server";

// 簡易 UA 白名單，可依需求擴充
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
  /Mozilla\/\d+/i, // 標準瀏覽器 UA
];

// 簡易 UA 黑名單，可依需求擴充
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

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";

  // 白名單直接放行
  if (UA_WHITELIST.some((regex) => regex.test(ua))) {
    return NextResponse.next();
  }

  // 黑名單：封鎖並避免 CDN 快取
  if (UA_BLOCKLIST.some((regex) => regex.test(ua))) {
    const blocked = new NextResponse(
      "<h1>Access Denied</h1><p>Your browser or tool is not supported.</p>",
      {
        status: 403,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
    blocked.headers.set("x-middleware-cache", "no-cache");
    return blocked;
  }

  // 其他 UA：放行但告訴 Vercel 不要使用快取 
  const res = NextResponse.next();
  res.headers.set("x-middleware-cache", "no-cache");
  return res;
}

// 作用於除 _next/static 與 api/health 之外的所有路徑
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health).*)",
  ],
}; 