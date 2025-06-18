/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /** 讓 Funnel 網域能載入開發資源 (_next/…) */
  allowedDevOrigins: [
    "*.tail77df8d.ts.net",
  ],

  // 在生產建置時忽略 ESLint 錯誤，避免 next build 中斷
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
