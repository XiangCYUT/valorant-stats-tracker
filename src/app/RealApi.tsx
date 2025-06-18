"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Card from "@/components/Card";

interface AccountData {
    puuid: string;
    gameName: string;
    tagLine: string;
}

interface ActiveShardData {
    puuid: string;
    game: string;
    activeShard: string;
}

// 錯誤類型，用於存儲錯誤代碼而非直接存儲錯誤訊息
type ErrorType = 
    | { type: "contact_developer" }
    | { type: "player_not_found" }
    | { type: "rate_limit_exceeded" }
    | { type: "server_error" }
    | { type: "unknown_error" }
    | { type: "custom", message: string };

export default function RealApi() {
    const { t } = useLanguage();
    const [accountData, setAccountData] = useState<AccountData | null>(null);
    const [activeShardData, setActiveShardData] = useState<ActiveShardData | null>(null);
    const [errorType, setErrorType] = useState<ErrorType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [gameName, setGameName] = useState("TenZ");
    const [tagLine, setTagLine] = useState("001");

    // 檢查輸入框是否都有資料
    const isFormValid = gameName.trim() !== "" && tagLine.trim() !== "";

    // 根據錯誤類型獲取當前語言的錯誤訊息
    const getErrorMessage = (error: ErrorType): string => {
        switch (error.type) {
            case "contact_developer":
                return t("contactDeveloper");
            case "player_not_found":
                return t("playerNotFound");
            case "rate_limit_exceeded":
                return t("rateLimitExceeded");
            case "server_error":
                return t("serverError");
            case "unknown_error":
                return t("unknownError");
            case "custom":
                return error.message;
        }
    };

    // 錯誤處理共用函式，返回錯誤類型而非錯誤訊息
    const handleApiError = (response: Response, errorData: any): ErrorType => {
        // 根據狀態碼返回錯誤類型
        switch (response.status) {
            case 400:
                return { type: "contact_developer" };
            case 401:
                return { type: "contact_developer" };
            case 403:
                return { type: "contact_developer" };
            case 404:
                return { type: "player_not_found" };
            case 405:
                return { type: "contact_developer" };
            case 415:
                return { type: "contact_developer" };
            case 429:
                return { type: "rate_limit_exceeded" };
            case 500:
            case 502:
                return { type: "server_error" };
            default:
                return { type: "contact_developer" };
        }
    };

    const fetchData = async () => {
        setErrorType(null);
        setAccountData(null);
        setActiveShardData(null);
        setIsLoading(true);
        console.log("fetching account data...");
        
        try {
            // Step1: Account
            const accountRes = await fetch(`/api/riot/account/${gameName}/${tagLine}`);
            if (!accountRes.ok) {
                const errBody = await accountRes.json();
                throw handleApiError(accountRes, errBody);
            }
            const account = await accountRes.json();

            // Step2: Active Shard
            const shardRes = await fetch(`/api/riot/active-shard/${account.puuid}`);

            let shard: ActiveShardData | null = null;
            if (!shardRes.ok) {
                // 404 代表此 PUUID 尚未產生 VALORANT active shard，屬可接受情況
                if (shardRes.status !== 404) {
                    const errBody = await shardRes.json();
                    throw handleApiError(shardRes, errBody);
                }
            } else {
                shard = await shardRes.json();
            }

            // 更新狀態：account 必定有，shard 可能為 null
            setAccountData(account);
            setActiveShardData(shard);
            console.log("fetch complete");
        } catch (e: any) {
            // 發生錯誤時，確保不顯示不完整的帳號資訊
            setAccountData(null);
            setActiveShardData(null);

            if (e && e.type) {
                // 已映射為 ErrorType
                setErrorType(e);
                console.log("error type:", e.type);
            } else {
                setErrorType({ type: "unknown_error" });
                console.log("unknown error:", e);
            }
        } finally {
            setIsLoading(false);
            console.log("fetch finished");
        }
    };

    return (
        <Card id="demo">
            <h2 className="text-2xl font-bold text-center mb-6 text-primary-600 dark:text-primary-500">{t("realApiTitle")}</h2>
            <div className="text-center mb-4">
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                <div className="flex items-center space-x-3">
                    <input 
                        suppressHydrationWarning
                        type="text" 
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        className="min-w-[150px] w-full bg-light-300 border border-light-500 dark:bg-dark-400 dark:border-dark-300 rounded-md px-4 py-2.5 text-gray-800 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        placeholder={t("riotIdPlaceholder")}
                    />
                    <span className="flex items-center justify-center bg-light-400 dark:bg-dark-300 px-4 py-2.5 text-gray-600 dark:text-light-400 border border-light-500 dark:border-dark-300 rounded-md min-w-[40px]">#</span>
                    <input 
                        suppressHydrationWarning
                        type="text" 
                        value={tagLine}
                        onChange={(e) => setTagLine(e.target.value)}
                        className="w-[100px] bg-light-300 border border-light-500 dark:bg-dark-400 dark:border-dark-300 rounded-md px-4 py-2.5 text-gray-800 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        placeholder={t("tagPlaceholder")}
                    />
                </div>
                <button
                    onClick={fetchData}
                    disabled={isLoading || !isFormValid}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-500"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("loading")}
                        </div>
                    ) : t("fetchPuuid")}
                </button>
            </div>

            {errorType && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg w-full">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{t("error")}</h3>
                    <div className="text-sm text-left bg-white/80 dark:bg-gray-800/50 p-3 rounded overflow-auto max-h-60">
                        <p className="text-red-600 dark:text-red-300">{getErrorMessage(errorType)}</p>
                    </div>
                </div>
            )}

            {(accountData || activeShardData) && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg w-full">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                        {t("accountInfo")}
                    </h3>
                    
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full bg-white dark:bg-dark-400 border border-light-500 dark:border-dark-300 rounded-lg">
                            <thead>
                                <tr className="bg-light-400 dark:bg-dark-300 text-gray-700 dark:text-light-300">
                                    <th className="py-2 px-4 border-b border-light-500 dark:border-dark-300 text-left">{t("puuidLabel")}</th>
                                    <th className="py-2 px-4 border-b border-light-500 dark:border-dark-300 text-left">{t("activeShardLabel")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-light-300 dark:hover:bg-dark-300/50">
                                    <td className="py-2 px-4 border-b border-light-500 dark:border-dark-300 text-gray-800 dark:text-light-100 break-all">
                                        {accountData?.puuid || "-"}
                                    </td>
                                    <td className="py-2 px-4 border-b border-light-500 dark:border-dark-300 text-gray-800 dark:text-light-100">
                                        {activeShardData?.activeShard || "-"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Card>
    );
} 