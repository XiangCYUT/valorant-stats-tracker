/*
  Riot API 共用函式庫 (使用原生 fetch)
  --------------------------------------------------
  1. getAccount  : 依照 Riot ID 取得 PUUID 等資料
  2. getActiveShard : 依照 PUUID 取得 activeShard
  --------------------------------------------------
  NOTE: 只在伺服器端 (Route Handler / Server Action) 使用。
*/

const RIOT_API_KEY = process.env.RIOT_API_KEY || process.env.Development_API_Key || "";

const ACCOUNT_URL = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id";
const ACTIVE_SHARD_REGIONS = ["americas", "asia", "europe"] as const;

const buildActiveShardUrl = (region: string, puuid: string) =>
  `https://${region}.api.riotgames.com/riot/account/v1/active-shards/by-game/val/by-puuid/${puuid}`;

export interface RiotApiError {
  status: number | string;
  message: string;
}

export interface AccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface ActiveShardData {
  puuid: string;
  game: string;
  activeShard: string;
}

const authHeader = {
  "X-Riot-Token": RIOT_API_KEY,
};

const fetchJson = async <T>(url: string): Promise<T> => {
  console.log("[RIOT] →", url);
  const res = await fetch(url, { headers: authHeader });
  console.log("[RIOT] ←", res.status, url);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      body: errorBody,
    };
  }
  return (await res.json()) as T;
};

export const getAccount = async (
  gameName: string,
  tagLine: string
): Promise<AccountData> => {
  return await fetchJson<AccountData>(`${ACCOUNT_URL}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
};

export const getActiveShard = async (puuid: string): Promise<ActiveShardData> => {
  let lastErr: any;
  for (const region of ACTIVE_SHARD_REGIONS) {
    try {
      return await fetchJson<ActiveShardData>(buildActiveShardUrl(region, puuid));
    } catch (err: any) {
      // 若為 404，繼續嘗試下一個 region；其它錯誤直接丟出
      if (err?.status !== 404) throw err;
      lastErr = err;
    }
  }
  throw lastErr;
};

// 方便一次性取得
export const fetchPlayerData = async (
  gameName: string,
  tagLine: string
): Promise<{ account: AccountData; shard: ActiveShardData }> => {
  const account = await getAccount(gameName, tagLine);
  const shard = await getActiveShard(account.puuid);
  return { account, shard };
}; 