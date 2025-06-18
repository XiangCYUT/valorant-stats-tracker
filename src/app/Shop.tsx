"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Card from "@/components/Card";

// Define the type for a single shop item
interface ShopItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function Shop() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Card>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t("shopTitle")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("shopNotice")}</p>
        <button
          onClick={fetchShop}
          disabled={isLoading}
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
                className="bg-white dark:bg-dark-400 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-light-500 dark:border-dark-300"
              >
                <div className="h-40 bg-light-200 dark:bg-dark-500 flex items-center justify-center p-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-light-100 truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
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