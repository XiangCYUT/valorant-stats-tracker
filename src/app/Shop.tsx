"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Card from "@/components/Card";

// Define the type for a single shop item
interface ShopItem {
  id: string;
  price: number;
  image_url: string;
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

export default function Shop() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentData, setContentData] = useState<any>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const currentLocale = i18n.language || 'en-US';

  // 載入當前語言的內容檔案
  useEffect(() => {
    setIsContentLoading(true);
    loadContentFile(currentLocale).then(data => {
      setContentData(data);
      setIsContentLoading(false);
    }).catch(err => {
      setIsContentLoading(false);
    });
  }, [currentLocale]);

  const fetchShop = async () => {
    setError("");
    setItems([]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/shop");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data.daily_offers);
    } catch (e: any) {
      setError(
        `Failed to fetch shop data: ${e.message}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 根據 ID 查找皮膚名稱
  const getSkinNameById = (id: string): string => {
    if (!contentData) {
      return "Loading..."; // 當內容尚未載入時顯示載入中
    }
    
    try {
      // 在 skins 中尋找皮膚
      const skin = contentData.skins?.find((item: any) => item.id === id);
      if (skin?.name) {
        return skin.name;
      }
      
      return `Unknown Skin (${id.substring(0, 8)}...)`;
    } catch (error) {
      return `Error (${id.substring(0, 8)}...)`;
    }
  };

  // 拆分皮膚名稱為造型名稱和武器名稱
  const splitSkinName = (fullName: string): { skinName: string; weaponName: string } => {
    // 特殊情況處理
    if (fullName === "Loading..." || fullName.startsWith("Unknown Skin") || fullName.startsWith("Error")) {
      return { skinName: fullName, weaponName: "" };
    }
    
    const lastSpaceIndex = fullName.lastIndexOf(' ');
    if (lastSpaceIndex === -1) {
      return { skinName: fullName, weaponName: '' };
    }
    
    const skinName = fullName.substring(0, lastSpaceIndex);
    const weaponName = fullName.substring(lastSpaceIndex + 1);
    
    return { skinName, weaponName };
  };

  return (
    <Card>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t("shopTitle")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("shopNotice")}</p>
        
        {isContentLoading && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            <span className="inline-block animate-pulse">●</span> {t("loadingContent")}
          </div>
        )}
        
        <button
          onClick={fetchShop}
          disabled={isLoading || isContentLoading}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold py-2.5 px-5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-500 mt-4"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("loadingShop")}
            </div>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
              </svg>
              {t("refreshShop")}
            </div>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg w-full">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {items.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-dark-400 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-light-500 dark:border-dark-300 flex flex-col"
              >
                <div className="h-40 bg-light-200 dark:bg-dark-500 flex items-center justify-center p-4">
                  <img
                    src={item.image_url}
                    alt={getSkinNameById(item.id)}
                    className="h-full object-contain"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="h-14 flex flex-col justify-center mb-2">
                    {(() => {
                      const fullName = getSkinNameById(item.id);
                      const { skinName, weaponName } = splitSkinName(fullName);
                      
                      return (
                        <>
                          <h3 
                            className="font-bold text-lg text-gray-800 dark:text-light-100 truncate"
                            title={skinName}
                          >
                            {skinName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={weaponName}>
                            {weaponName}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">{item.price} VP</span>
                    <span className="bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 text-xs font-semibold px-2 py-1 rounded-full">
                      Limited
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
} 