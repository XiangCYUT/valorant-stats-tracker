/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /** 讓 Funnel 網域能載入開發資源 (_next/…) */
  allowedDevOrigins: ["*.tail77df8d.ts.net"],

  // 在生產建置時忽略 ESLint 錯誤，避免 next build 中斷
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 全站安全標頭
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 強制 HTTPS – 2 年 (含子網域) 並申請 preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // 避免 MIME Sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 防止點擊劫持
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 精簡 referrer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions Policy (部分範例，可依需求調整)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
