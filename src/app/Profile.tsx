"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Card from "@/components/Card";
import AccuracyChart from "@/components/AccuracyChart";

// Define the types for the profile data structure
interface PlayerStats {
    headshot_rate: string;
    most_used_weapon: {
        name: string; // 這裡存儲的是武器ID
        kills: number;
    };
    win_rate: string;
    map_win_rates: {
        map: string; // 這裡存儲的是地圖ID
        rate: string;
    }[];
}

interface PlayerProfile {
    gameName: string;
    tagLine: string;
    puuid: string;
    stats: PlayerStats;
}

// 精確度資料介面
interface RawMatchData {
    Date: string;
    "Head Shot": string;
    "Body Shot": string;
    "Foot Shot": string;
}

interface ProcessedAccuracyData {
    totalHits: {
        head: number;
        body: number;
        legs: number;
    };
    percentages: {
        head: number;
        body: number;
        legs: number;
    };
    avgHeadshotPercentage: number;
    chartData: {
        index: number;
        value: number;
        headshotPercentage: number;
        rawDate: string; // 用於顯示日期時間提示
    }[];
}

// 快取機制，避免重複載入 JSON 檔案
let contentCache: {
    'zh-TW'?: any;
    'en-US'?: any;
} = {};

// 將簡短的語言代碼映射到完整的語言代碼
function getFullLocale(locale: string): string {
    if (locale.startsWith('zh')) return 'zh-TW';
    if (locale.startsWith('en')) return 'en-US';
    return 'en-US'; // 默認返回英文
}

// 載入對應語言的內容檔案
async function loadContentFile(locale: string) {
    const fullLocale = getFullLocale(locale);

    if (contentCache[fullLocale as keyof typeof contentCache]) {
        return contentCache[fullLocale as keyof typeof contentCache];
    }

    try {
        const response = await fetch(`/api/content?locale=${fullLocale}`);
        if (!response.ok) throw new Error(`Failed to load content file for ${fullLocale}`);
        const content = await response.json();
        contentCache[fullLocale as keyof typeof contentCache] = content;
        return content;
      } catch (error) {
    return null;
  }
}

// 處理精確度統計資料
const processAccuracyData = (rawData: RawMatchData[]): ProcessedAccuracyData => {
    // 因為demo數據只有9場，取全部
    const recentMatches = rawData;

    // 計算總和
    const totalHits = recentMatches.reduce(
        (acc, match) => ({
            head: acc.head + parseInt(match["Head Shot"]),
            body: acc.body + parseInt(match["Body Shot"]),
            legs: acc.legs + parseInt(match["Foot Shot"])
        }),
        { head: 0, body: 0, legs: 0 }
    );

    const totalShots = totalHits.head + totalHits.body + totalHits.legs;

    // 計算百分比
    const percentages = {
        head: parseFloat(((totalHits.head / totalShots) * 100).toFixed(1)),
        body: parseFloat(((totalHits.body / totalShots) * 100).toFixed(1)),
        legs: parseFloat(((totalHits.legs / totalShots) * 100).toFixed(1))
    };

    // 準備圖表資料
    const chartData = recentMatches.map((match, index) => {
        const headShots = parseInt(match["Head Shot"]) || 0;
        const bodyShots = parseInt(match["Body Shot"]) || 0;
        const footShots = parseInt(match["Foot Shot"]) || 0;
        const matchTotal = headShots + bodyShots + footShots;

        const headshotPercentage = matchTotal > 0 ?
            parseFloat(((headShots / matchTotal) * 100).toFixed(1)) : 0;

        return {
            index: index,
            value: headshotPercentage,
            headshotPercentage: headshotPercentage,
            rawDate: match.Date,
        };
    });

    return {
        totalHits,
        percentages,
        avgHeadshotPercentage: percentages.head,
        chartData
    };
};



export default function Profile() {
    const { t, i18n } = useTranslation();
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gameName, setGameName] = useState("DemoPlayer");
    const [tagLine, setTagLine] = useState("DEMO");
    const [contentData, setContentData] = useState<any>(null);
    const [accuracyData, setAccuracyData] = useState<ProcessedAccuracyData | null>(null);
    const currentLocale = i18n.language || 'en-US';

    // 載入當前語言的內容檔案
    useEffect(() => {
        loadContentFile(currentLocale).then(data => {
            setContentData(data);
        });
    }, [currentLocale]);

    const fetchProfile = async () => {
        setError("");
        setProfile(null);
        setIsLoading(true);
        try {
            // NOTE: In a real app, we would use gameName and tagLine to fetch data.
            // Here we just call the mock endpoint.
            const response = await fetch("/api/profile");
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProfile(data.player);

            // 同時加載準確度數據
            try {
                const accuracyResponse = await fetch('/data/demoProfile.json');
                if (!accuracyResponse.ok) throw new Error('Failed to load accuracy data');
                const accuracyData = await accuracyResponse.json();

                // 處理資料
                const processedData = processAccuracyData(accuracyData);
                setAccuracyData(processedData);
            } catch (error) {
                // 靜默處理錯誤
            }
        } catch (e: any) {
            setError(`Failed to fetch profile data: ${e.message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    // 根據 ID 查找武器名稱
    const getWeaponNameById = (id: string): string => {
        if (!contentData) return id;

        // 在 equips 中尋找武器
        const weapon = contentData.equips?.find((item: any) => item.id === id);
        if (weapon?.name) {
            return weapon.name;
        }

        return id; // 如果找不到，就返回原始 ID
    };

    // 根據 ID 查找地圖名稱
    const getMapNameById = (id: string): string => {
        if (!contentData) return id;

        // 在 maps 中尋找地圖
        const map = contentData.maps?.find((item: any) => item.id === id);
        if (map?.name) {
            return map.name;
        }

        return id; // 如果找不到，就返回原始 ID
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-center mb-6 text-primary-600 dark:text-primary-500">{t("profileTitle")}</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        className="min-w-[150px] w-full bg-light-300 border border-light-500 dark:bg-dark-400 dark:border-dark-300 rounded-md px-4 py-2.5 text-gray-800 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        placeholder={t("riotIdPlaceholder")}
                    />
                    <span className="flex items-center justify-center bg-light-400 dark:bg-dark-300 px-4 py-2.5 text-gray-600 dark:text-light-400 border border-light-500 dark:border-dark-300 rounded-md min-w-[40px]">#</span>
                    <input
                        type="text"
                        value={tagLine}
                        onChange={(e) => setTagLine(e.target.value)}
                        className="w-[100px] bg-light-300 border border-light-500 dark:bg-dark-400 dark:border-dark-300 rounded-md px-4 py-2.5 text-gray-800 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        placeholder={t("tagPlaceholder")}
                    />
                </div>
                <button
                    onClick={fetchProfile}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-500/50 text-white font-bold py-2.5 px-5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-500"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("loading")}
                        </div>
                    ) : t("fetch")}
                </button>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg w-full">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {profile && (
                <>
                    <div className="mt-6">
                        <div className="bg-dark-800 p-6 rounded-lg shadow-sm border border-dark-700">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-dark-700">
                                <h3 className="text-xl font-bold text-light-100 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-500">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                    {profile.gameName}
                                </h3>
                                <span className="text-light-400 bg-dark-700 px-3 py-1 rounded-full text-sm font-medium">#{profile.tagLine}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                                <div className="bg-dark-700 p-4 rounded-lg">
                                    <p className="text-light-400 text-sm mb-1">{t("winRate")}</p>
                                    <p className="text-2xl font-bold text-light-100">{profile.stats.win_rate}</p>
                                </div>
                                <div className="bg-dark-700 p-4 rounded-lg">
                                    <p className="text-light-400 text-sm mb-1">{t("hsRate")}</p>
                                    <p className="text-2xl font-bold text-light-100">{profile.stats.headshot_rate}</p>
                                </div>
                                <div className="bg-dark-700 p-4 rounded-lg">
                                    <p className="text-light-400 text-sm mb-1">{t("mostUsedWeapon")}</p>
                                    <p className="text-lg font-semibold text-light-100">
                                        {getWeaponNameById(profile.stats.most_used_weapon.name)}
                                    </p>
                                    <p className="text-xs text-light-400">{profile.stats.most_used_weapon.kills} kills</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-3 text-light-100 border-l-4 border-primary-500 pl-3">{t("mapWinRate")}</h4>
                                <div className="space-y-2">
                                    {profile.stats.map_win_rates.map(map_rate => (
                                        <div key={map_rate.map} className="flex justify-between items-center bg-dark-700 p-3 rounded-lg">
                                            <span className="font-medium text-light-300">
                                                {getMapNameById(map_rate.map)}
                                            </span>
                                            <span className="font-bold bg-green-800/30 text-green-400 px-2 py-1 rounded">{map_rate.rate}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accuracy 卡片 */}
                    {accuracyData && (
                        <div className="mt-6">
                            <div className="bg-dark-800 p-6 rounded-lg shadow-sm border border-dark-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-light-100 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-500">
                                            <path d="M15.042 21.672L13.684 21.69l1.568 1.524a2.5 2.5 0 003.536 0l1.568-1.524-1.358-.018z" />
                                            <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.414.336-.75.75-.75h3c.414 0 .75.336.75.75s-.336.75-.75.75h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                        </svg>
                                        {t("accuracyTitle")}
                                    </h3>
                                    <span className="text-light-400 text-sm">{t("accuracyLastMatches")}</span>
                                </div>

                                {/* 第一行：人物圖 + 統計數據 */}
                                <div className="flex items-center gap-6 mb-6">
                                    {/* 人物圖 */}
                                    <div className="flex-shrink-0">
                                        <div className="relative w-16 h-32 flex items-center justify-center">
                                            {(() => {
                                                // 找出最高的Hits部位
                                                const maxHits = Math.max(
                                                    accuracyData.totalHits.head,
                                                    accuracyData.totalHits.body,
                                                    accuracyData.totalHits.legs
                                                );
                                                
                                                const headColor = accuracyData.totalHits.head === maxHits ? "#22C55E" : "#FFFFFF";
                                                const bodyColor = accuracyData.totalHits.body === maxHits ? "#22C55E" : "#FFFFFF";
                                                const legsColor = accuracyData.totalHits.legs === maxHits ? "#22C55E" : "#FFFFFF";
                                                
                                                return (
                                                    <svg width="40" height="90" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        {/* 頭部 ─ 動態顏色 */}
                                                        <circle cx="22" cy="6.153" r="6.153" fill={headColor} />

                                                        {/* 身體 ─ 動態顏色 */}
                                                        <g transform="translate(20, 18)">
                                                            <g transform="translate(-14.6425, 0)">
                                                                <path d="M29.285 26.472L24.17 13.678l-1.352 6.831H10.512l-1.363-6.84-5.117 12.8a2.049 2.049 0 11-3.957-1.061L6.441 1.639h.008A2.055 2.055 0 018.461 0h4.1l4.11 4.1 4.1-4.1h4.111a2.048 2.048 0 012.016 1.712l6.352 23.7a2.049 2.049 0 11-3.959 1.061z"
                                                                      fill={bodyColor} />
                                                            </g>
                                                        </g>

                                                        {/* 腿部 ─ 動態顏色 */}
                                                        <g transform="translate(20, 49)">
                                                            <g transform="translate(-10, 0)">
                                                                <path d="M6.521 41.025h0l-6.52 0L5.863 0h12.893l5.857 41.021-6.508 0L12.307 8.2 6.521 41.024z"
                                                                      fill={legsColor} />
                                                            </g>
                                                        </g>
                                                    </svg>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* 統計數據 */}
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        {(() => {
                                            // 找出最高的百分比
                                            const maxPercentage = Math.max(
                                                accuracyData.percentages.head,
                                                accuracyData.percentages.body,
                                                accuracyData.percentages.legs
                                            );
                                            
                                            return (
                                                <>
                                                    <div className="text-center">
                                                        <div className="text-light-300 text-sm mb-1">{t("accuracyHead")}</div>
                                                        <div className={`font-bold text-lg ${accuracyData.percentages.head === maxPercentage ? 'text-green-500' : 'text-light-100'}`}>
                                                            {accuracyData.percentages.head}%
                                                        </div>
                                                        <div className="text-light-400 text-xs">{accuracyData.totalHits.head} {t("accuracyHits")}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-light-300 text-sm mb-1">{t("accuracyBody")}</div>
                                                        <div className={`font-bold text-lg ${accuracyData.percentages.body === maxPercentage ? 'text-green-500' : 'text-light-100'}`}>
                                                            {accuracyData.percentages.body}%
                                                        </div>
                                                        <div className="text-light-400 text-xs">{accuracyData.totalHits.body} {t("accuracyHits")}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-light-300 text-sm mb-1">{t("accuracyLegs")}</div>
                                                        <div className={`font-bold text-lg ${accuracyData.percentages.legs === maxPercentage ? 'text-green-500' : 'text-light-100'}`}>
                                                            {accuracyData.percentages.legs}%
                                                        </div>
                                                        <div className="text-light-400 text-xs">{accuracyData.totalHits.legs} {t("accuracyHits")}</div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* 第二行：圖表 */}
                                <div>
                                    <div className="mb-2">
                                        <h4 className="text-sm font-semibold text-light-400">{t("accuracyAvgHS")}</h4>
                                    </div>
                                    <AccuracyChart data={accuracyData.chartData} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            

        </Card>
    );
} 