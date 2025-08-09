// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * 允許的搜尋引擎/社群抓取 UA（盡量涵蓋 Google 全家與常見社群預覽）
 */
const CRAWLER_ALLOW = [
  /Googlebot/i,              // 網頁主要爬蟲
  /Google-InspectionTool/i,  // Search Console 即時檢查
  /GoogleOther/i,            // 其他 Google 抓取器
  /Googlebot-Image/i,        // 圖片
  /AdsBot-Google/i,          // Ads 抓取
  /APIs-Google/i,            // APIs-Google
  /bingbot/i,
  /Applebot/i,
  /DuckDuckBot/i,
  /BaiduSpider/i,
  /YandexBot/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /Slackbot/i,
  /WhatsApp/i,
  /Discordbot/i,
  /LinkedInBot/i,
];

/**
 * 明確拒絕的 UA（常見程式庫直連）
 */
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

/**
 * 判斷是否為「導覽型請求」：
 * - 瀏覽器直接開頁/換頁（GET + Accept: text/html）
 * - 避免攔 API / XHR / fetch / 圖片等資源請求
 */
function isNavigationHTML(req: NextRequest) {
  const accept = req.headers.get("accept") || "";
  return req.method === "GET" && accept.includes("text/html");
}

/**
 * 放行不該被驗證擋住的路徑（靜態、內部、SEO 檔）
 */
function isAlwaysAllowedPath(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/recaptcha" ||
    pathname === "/api/recaptcha-verify" ||
    pathname === "/api/healthz"
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get("user-agent") || "";
  const method = req.method;

  // 1) 放行「明確不應攔」的路徑
  if (isAlwaysAllowedPath(pathname)) {
    return NextResponse.next();
  }

  // 2) 放行 HEAD（健康檢查/預抓取常用）
  if (method === "HEAD") {
    return NextResponse.next();
  }

  // 3) 放行搜尋引擎/社群抓取器
  if (CRAWLER_ALLOW.some((r) => r.test(ua))) {
    return NextResponse.next();
  }

  // 4) 黑名單：直接 403
  if (UA_BLOCKLIST.some((r) => r.test(ua))) {
    const res403 = new NextResponse(
      JSON.stringify({ error: "Forbidden" }, null, 2),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
    res403.headers.set("x-middleware-cache", "no-cache");
    return res403;
  }

  // 5) 已通過 reCAPTCHA 的人類
  if (req.cookies.get("recaptcha_ok")?.value === "1") {
    return NextResponse.next();
  }

  // 6) 僅對「導覽型請求」做人機驗證導向，其餘（API/XHR/資源）放行
  if (isNavigationHTML(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/recaptcha";
    url.searchParams.set("next", pathname + search);
    const redirect = NextResponse.redirect(url, 302);
    redirect.headers.set("x-middleware-cache", "no-cache");
    return redirect;
  }

  // 非 HTML 導覽請求（例如 XHR/圖檔/CSS/JS）直接放行，避免誤傷
  return NextResponse.next();
}

/**
 * matcher：用「排除」方式避開 Next.js 內部與靜態資源，
 * 再額外放掉我們在函式內也有判斷過的 SEO 檔與驗證 API
 */
export const config = {
  matcher: [
    "/((?!_next/|assets/|public/|images/|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|api/recaptcha-verify|api/healthz|recaptcha).*)",
  ],
};
