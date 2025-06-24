"use server";

type ErrorType = 
  | { type: "contact_developer" }
  | { type: "player_not_found" }
  | { type: "rate_limit_exceeded" }
  | { type: "server_error" }
  | { type: "unknown_error" }
  | { type: "custom", message: string };

// 錯誤處理共用函式，返回錯誤類型
function handleApiError(response: Response, errorData: any): ErrorType {
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
}

export async function fetchRiotAccount(gameName: string, tagLine: string) {
  try {
    // Step1: Account
    const accountRes = await fetch(`${process.env.API_URL || ''}/api/riot/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameName,
        tagLine
      })
    });
    
    if (!accountRes.ok) {
      const errBody = await accountRes.json();
      return { error: handleApiError(accountRes, errBody) };
    }
    const account = await accountRes.json();

    // Step2: Active Shard
    const shardRes = await fetch(`${process.env.API_URL || ''}/api/riot/active-shard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puuid: account.puuid
      })
    });

    let shard = null;
    if (!shardRes.ok) {
      // 404 代表此 PUUID 尚未產生 VALORANT active shard，屬可接受情況
      if (shardRes.status !== 404) {
        const errBody = await shardRes.json();
        return { error: handleApiError(shardRes, errBody) };
      }
    } else {
      shard = await shardRes.json();
    }

    // 返回結果
    return { 
      accountData: account, 
      activeShardData: shard 
    };
  } catch (error: any) {
    return { 
      error: { 
        type: "unknown_error", 
        message: error.message 
      }
    };
  }
} 