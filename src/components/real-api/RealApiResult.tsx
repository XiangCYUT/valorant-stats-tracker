"use client";

interface RealApiResultProps {
  result: {
    error?: {
      type: string;
      message?: string;
    };
    accountData?: {
      puuid: string;
      gameName: string;
      tagLine: string;
    };
    activeShardData?: {
      puuid: string;
      game: string;
      activeShard: string;
    } | null;
  };
  dict: Record<string, string>;
}

export default function RealApiResult({ result, dict }: RealApiResultProps) {
  const t = (key: string) => dict[key] ?? key;
  
  // 根據錯誤類型獲取當前語言的錯誤訊息
  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
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
      default:
        return result.error?.message || t("unknownError");
    }
  };

  // 顯示錯誤訊息
  if (result.error) {
    return (
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg w-full">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{t("error")}</h3>
        <div className="text-sm text-left bg-white/80 dark:bg-gray-800/50 p-3 rounded overflow-auto max-h-60">
          <p className="text-red-600 dark:text-red-300">{getErrorMessage(result.error.type)}</p>
          {result.error.message && result.error.type === "custom" && (
            <p className="text-red-600 dark:text-red-300 mt-2">{result.error.message}</p>
          )}
        </div>
      </div>
    );
  }

  // 顯示帳號資訊
  if (result.accountData) {
    return (
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
                  {result.accountData?.puuid || "-"}
                </td>
                <td className="py-2 px-4 border-b border-light-500 dark:border-dark-300 text-gray-800 dark:text-light-100">
                  {result.activeShardData?.activeShard || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 未知情況，返回空
  return null;
} 