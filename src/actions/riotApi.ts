"use server";

import { getAccount, getActiveShard } from "@/lib/riotApi";

type ErrorType = 
  | { type: "contact_developer" }
  | { type: "player_not_found" }
  | { type: "rate_limit_exceeded" }
  | { type: "server_error" }
  | { type: "unknown_error" }
  | { type: "custom", message: string };

// 錯誤處理共用函式，返回錯誤類型
function handleApiError(status: number, errorData: any): ErrorType {
  console.error(`[Server] API Error: Status ${status}`, errorData);
  
  // 根據狀態碼返回錯誤類型
  switch (status) {
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
}

export async function fetchRiotAccount(gameName: string, tagLine: string) {
  // 只在失敗時印出日誌，成功時不印出
  try {
    // 直接使用 riotApi 函數庫，而不是通過 API 路由
    // Step1: Account - 直接調用 getAccount 函數
    const account = await getAccount(gameName, tagLine);

    // Step2: Active Shard - 直接調用 getActiveShard 函數
    let shard = null;
    try {
      shard = await getActiveShard(account.puuid);
    } catch (error: any) {
      // 如果是 404 錯誤，代表玩家尚未有 shard，這是可接受的
      if (error.status !== 404) {
        console.error(`[Server] Shard API error:`, error);
        return { error: handleApiError(error.status, error.body) };
      }
    }

    // 返回結果，成功時不印出日誌
    return { 
      accountData: account, 
      activeShardData: shard 
    };
  } catch (error: any) {
    console.error(`[Server] Error fetching account data:`, error);
    
    // 處理自定義錯誤格式
    if (error.status) {
      return { 
        error: handleApiError(error.status, error.body) 
      };
    }
    
    // 處理一般錯誤
    return { 
      error: { 
        type: "unknown_error", 
        message: error.message || "Unknown error occurred" 
      }
    };
  }
} 