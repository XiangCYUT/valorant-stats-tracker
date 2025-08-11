"use client";

import { useState } from "react";
import { fetchRiotAccount } from "@/actions/riotApi";
import RealApiResult from "./RealApiResult";

interface RealApiFormProps {
  dict: Record<string, string>;
}

export default function RealApiForm({ dict }: RealApiFormProps) {
  const t = (key: string) => dict[key] ?? key;
  const [gameName, setGameName] = useState("TenZ");
  const [tagLine, setTagLine] = useState("001");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    error?: { type: string; message?: string };
    accountData?: any;
    activeShardData?: any;
  } | null>(null);

  // 檢查輸入框是否都有資料
  const isFormValid = gameName.trim() !== "" && tagLine.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // 調用 Server Action 獲取數據
      const data = await fetchRiotAccount(gameName, tagLine);
      setResult(data);
    } catch (error: any) {
      // 處理 Server Action 調用錯誤
      setResult({
        error: {
          type: "unknown_error",
          message: error.message || "未知錯誤"
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-primary-600 dark:text-primary-500">{t("realApiTitle")}</h2>
      <div className="text-center mb-4">
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
            type="submit"
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
      </form>

      {/* 結果顯示區域 - 只在有數據時顯示 */}
      {result && <RealApiResult result={result} dict={dict} />}
    </>
  );
} 