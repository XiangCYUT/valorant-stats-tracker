"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "zh-tw" | "en";

interface LangContextProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  "zh-tw": {
    title: "Valorant 網頁工具",
    description: "目前此網站僅為 demo，且未與任何第三方 API 串接。",
    realApiTitle: "Riot 真實 API 查詢（開發金鑰）",
    riotIdPlaceholder: "Riot ID",
    tagPlaceholder: "TAG",
    fetchPuuid: "查詢",
    loading: "載入中...",
    error: "錯誤",
    successResponse: "成功！Riot API 回傳：",
    accountInfo: "帳號資訊",
    puuidLabel: "PUUID",
    activeShardLabel: "Active Shard",
    profileTitle: "玩家戰績（模擬）",
    fetch: "查詢",
    winRate: "勝率",
    hsRate: "爆頭率",
    mostUsedWeapon: "最常用武器",
    mapWinRate: "各地圖勝率",
    shopTitle: "每日商店（模擬）",
    refreshShop: "重新整理商店",
    loadingShop: "載入中...",
    shopNotice: "正式功能會等到獲得production API Key之後才會推出",
    login: "Riot 登入",
    loginTip: "連接正式 RSO 後開啟",
    comingSoon: "敬請期待",
    light: "淺色",
    dark: "深色",
    system: "跟隨系統",
    theme: "主題",
    systemTheme: "使用系統主題",
    useSystemTheme: "使用系統主題",
    switchToLight: "切換到淺色模式",
    switchToDark: "切換到深色模式",
    contactDeveloper: "請與開發者聯絡",
    playerNotFound: "玩家不存在",
    rateLimitExceeded: "超出 API 使用速率限制，請稍後再重試",
    serverError: "目前伺服器有問題，請稍後再查詢",
    unknownError: "發生未知錯誤",
    roadmapTitle: "Valorant Web Tool Roadmap",
    roadmapDescription: "開發進度和未來計劃",
    completedFeatures: "已完成功能",
    inProgressFeatures: "進行中功能",
    futurePlans: "未來計劃",
    techStack: "使用技術",
    frontendTech: "前端技術",
    backendTech: "後端技術",
    v01Title: "v0.1 – 基礎功能 (已完成)",
    v02Title: "v0.2 – 主題切換功能 (已完成)",
    v03Title: "v0.3 – 用戶認證與戰績 (進行中)",
    v04Title: "v0.4 – 進階統計 (規劃中)",
    v10Title: "v1.0 – 完整版本 (等待 production API Key)",
    riotApiIntegration: "Riot API 整合 - PUUID & activeShard (使用 dev apikey)；獲得 production API Key 後，會把 PUUID & activeShard 呈現在網頁上的資料移除，只顯示我們關心的資料",
    multiLanguageSupport: "多語言支援 (繁體中文、英文)",
    responsiveDesign: "響應式設計，適應不同螢幕尺寸",
    darkLightTheme: "深色/淺色主題切換",
    autoDetectTheme: "自動偵測並套用系統預設主題",
    themePreference: "主題偏好儲存功能",
    smoothThemeTransition: "平滑的主題切換動畫",
    adaptiveUI: "適應主題的 UI 元素和漸層色彩",
    rsoOauth: "Riot Sign On (RSO) OAuth 整合",
    userProfile: "用戶個人資料頁面 (目前為模擬資料)",
    recentMatches: "最近對戰記錄",
    basicStats: "基本戰績統計 (目前為模擬資料)",
    hitLocationCharts: "統計射擊頭部、身體、腳的圖表",
    topAgentMapStats: "前三高的地圖勝率與前三高的特務勝率",
    statsCardGeneration: "戰績卡片生成與分享",
    mobileOptimization: "行動裝置優化體驗 (RWD)",
    customDashboard: "自定義儀表板",
    esportsIntegration: "電子競技賽事整合",
    nextjs: "Next.js 14/15 (React 框架)",
    typescript: "TypeScript",
    tailwindCss: "Tailwind CSS v4",
    riotApiIntegrationTech: "Riot API 整合",
    themeSettings: "主題設置",
    nextRouteHandlers: "Next.js Route Handlers (Node)",
  },
  en: {
    title: "Valorant Web Tool",
    description: "This website is currently a demo and does not communicate with any unofficial APIs.",
    realApiTitle: "Real Riot API Query (Developer Key)",
    riotIdPlaceholder: "Riot ID",
    tagPlaceholder: "TAG",
    fetchPuuid: "Search",
    loading: "Loading...",
    error: "Error",
    successResponse: "Success! Riot API Response:",
    accountInfo: "Account Information",
    puuidLabel: "PUUID",
    activeShardLabel: "Active Shard",
    profileTitle: "Mock Player Statistics",
    fetch: "Fetch",
    winRate: "Win Rate",
    hsRate: "Headshot Rate",
    mostUsedWeapon: "Most Used Weapon",
    mapWinRate: "Map Win Rates",
    shopTitle: "Mock Daily Shop",
    refreshShop: "Refresh Shop",
    loadingShop: "Loading...",
    shopNotice: "Official features will be available after obtaining a production API Key",
    login: "Riot Login",
    loginTip: "Will be enabled after official RSO integration",
    comingSoon: "Coming Soon",
    light: "Light",
    dark: "Dark",
    system: "System",
    theme: "Theme",
    systemTheme: "System Theme",
    useSystemTheme: "Use System Theme",
    switchToLight: "Switch to Light Mode",
    switchToDark: "Switch to Dark Mode",
    contactDeveloper: "Please contact the developer",
    playerNotFound: "Player not found",
    rateLimitExceeded: "API rate limit exceeded, please try again later",
    serverError: "Server error, please try again later",
    unknownError: "An unknown error occurred",
    roadmapTitle: "Valorant Web Tool Roadmap",
    roadmapDescription: "Development Progress and Future Plans",
    completedFeatures: "Completed Features",
    inProgressFeatures: "In Progress",
    futurePlans: "Future Plans",
    techStack: "Used Technologies",
    frontendTech: "Frontend Technologies",
    backendTech: "Backend Technologies",
    v01Title: "v0.1 – Core Features (Completed)",
    v02Title: "v0.2 – Theme Switching (Completed)",
    v03Title: "v0.3 – User Authentication & Stats (In Progress)",
    v04Title: "v0.4 – Advanced Statistics (Planned)",
    v10Title: "v1.0 – Full Release (Waiting for production API Key)",
    riotApiIntegration: "Riot API Integration - PUUID & activeShard (using dev apikey); After obtaining production API Key, PUUID & activeShard data will be removed from the web display, showing only the data we care about",
    multiLanguageSupport: "Multi-language Support (Chinese, English)",
    responsiveDesign: "Responsive Design for All Screen Sizes",
    darkLightTheme: "Dark/Light Theme Switching",
    autoDetectTheme: "Auto-detect System Theme Preference",
    themePreference: "Theme Preference Storage",
    smoothThemeTransition: "Smooth Theme Transition Animations",
    adaptiveUI: "Adaptive UI Elements and Gradient Colors",
    rsoOauth: "Riot Sign On (RSO) OAuth Integration",
    userProfile: "User Profile Page (currently using mock data)",
    recentMatches: "Recent Match History",
    basicStats: "Basic Performance Statistics (currently using mock data)",
    hitLocationCharts: "Hit Location Statistics Charts (head, body, legs)",
    topAgentMapStats: "Top 3 Maps and Agents Win Rates",
    statsCardGeneration: "Performance Card Generation & Sharing",
    mobileOptimization: "Mobile Device Optimization (RWD)",
    customDashboard: "Custom Dashboards",
    esportsIntegration: "Esports Events Integration",
    nextjs: "Next.js 14/15 (React Framework)",
    typescript: "TypeScript",
    tailwindCss: "Tailwind CSS v4",
    riotApiIntegrationTech: "Riot API Integration",
    themeSettings: "Theme Settings",
    nextRouteHandlers: "Next.js Route Handlers (Node)",
  },
};

const LanguageContext = createContext<LangContextProps>({
  lang: "zh-tw",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("zh-tw");

  // 從 localStorage 讀取
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      // 如果保存的語言是 ja 或者不是有效的語言選項，則設置為默認語言
      if (saved === "zh-tw" || saved === "en") {
        setLang(saved as Lang);
      } else {
        // 如果保存的語言不再受支持，使用默認語言
        const defaultLang: Lang = "zh-tw";
        setLang(defaultLang);
        localStorage.setItem("lang", defaultLang);
      }
    }
  }, []);

  // 寫入 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  const t = (key: string) => translations[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 