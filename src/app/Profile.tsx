"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Card from "@/components/Card";

// Define the types for the profile data structure
interface PlayerStats {
    headshot_rate: string;
    most_used_weapon: {
        name: string;
        kills: number;
    };
    win_rate: string;
    map_win_rates: {
        map: string;
        rate: string;
    }[];
}

interface PlayerProfile {
    gameName: string;
    tagLine: string;
    puuid: string;
    stats: PlayerStats;
}

export default function Profile() {
    const { t } = useLanguage();
    const [profile, setProfile] = useState<PlayerProfile | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gameName, setGameName] = useState("DemoPlayer");
    const [tagLine, setTagLine] = useState("DEMO");

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
        } catch (e: any) {
            setError(`Failed to fetch profile data: ${e.message}.`);
        } finally {
            setIsLoading(false);
        }
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
                <div className="mt-6">
                    <div className="bg-white dark:bg-dark-400 p-6 rounded-lg shadow-sm border border-light-500 dark:border-dark-300">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-light-500 dark:border-dark-300">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-light-100 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-500">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                                {profile.gameName}
                            </h3>
                            <span className="text-gray-600 dark:text-light-400 bg-light-300 dark:bg-dark-300 px-3 py-1 rounded-full text-sm font-medium">#{profile.tagLine}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                            <div className="bg-light-200 dark:bg-dark-500 p-4 rounded-lg">
                                <p className="text-gray-500 dark:text-light-400 text-sm mb-1">{t("winRate")}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-light-100">{profile.stats.win_rate}</p>
                            </div>
                            <div className="bg-light-200 dark:bg-dark-500 p-4 rounded-lg">
                                <p className="text-gray-500 dark:text-light-400 text-sm mb-1">{t("hsRate")}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-light-100">{profile.stats.headshot_rate}</p>
                            </div>
                            <div className="bg-light-200 dark:bg-dark-500 p-4 rounded-lg">
                                <p className="text-gray-500 dark:text-light-400 text-sm mb-1">{t("mostUsedWeapon")}</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-light-100">{profile.stats.most_used_weapon.name}</p>
                                <p className="text-xs text-gray-500 dark:text-light-400">{profile.stats.most_used_weapon.kills} kills</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-light-100 border-l-4 border-primary-500 pl-3">{t("mapWinRate")}</h4>
                            <div className="space-y-2">
                                {profile.stats.map_win_rates.map(map_rate => (
                                    <div key={map_rate.map} className="flex justify-between items-center bg-light-200 dark:bg-dark-500 p-3 rounded-lg">
                                        <span className="font-medium text-gray-700 dark:text-light-300">{map_rate.map}</span>
                                        <span className="font-bold bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">{map_rate.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
} 