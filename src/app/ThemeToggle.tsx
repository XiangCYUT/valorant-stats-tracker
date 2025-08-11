"use client";

import { useTranslation } from 'react-i18next';
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 組件掛載後設置 mounted 狀態
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 關閉下拉菜單的點擊外部處理器
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 顯示實際套用的主題圖標
  const ThemeIcon = () => {
    if (!mounted) return null;
    
    if (resolvedTheme === 'dark') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      );
    }
  };

  // 在客戶端掛載前不顯示任何內容
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg bg-light-300 hover:bg-light-400 dark:bg-dark-400 dark:hover:bg-dark-300 text-light-900 dark:text-light-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          <div className="w-5 h-5"></div>
        </button>
        <span className="ml-2 text-xs px-2 py-1 rounded-lg bg-light-300 text-light-900">
          &nbsp;&nbsp;
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={t("themeSettings")}
        className="p-2 rounded-lg bg-light-300 hover:bg-light-400 dark:bg-dark-400 dark:hover:bg-dark-300 text-light-900 dark:text-light-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        title={t("themeSettings")}
      >
        <ThemeIcon />
      </button>
      
      {isMenuOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-44 max-w-[90vw] rounded-md shadow-lg bg-white dark:bg-dark-500 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                setTheme('light');
                setIsMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                theme === 'light' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-light-900 dark:text-light-100 hover:bg-light-100 dark:hover:bg-dark-400'
              }`}
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              {t("light")}
            </button>
            
            <button
              onClick={() => {
                setTheme('dark');
                setIsMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                theme === 'dark' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-light-900 dark:text-light-100 hover:bg-light-100 dark:hover:bg-dark-400'
              }`}
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
              {t("dark")}
            </button>
            
            <button
              onClick={() => {
                setTheme('system');
                setIsMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                theme === 'system' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-light-900 dark:text-light-100 hover:bg-light-100 dark:hover:bg-dark-400'
              }`}
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              {t("system")}
            </button>
          </div>
        </div>
      )}
      
      <span
        title={t("themeHint")}
        className={`text-xs px-2 py-1 rounded-lg ${
        resolvedTheme === 'dark' 
          ? 'bg-dark-400 text-light-200' 
          : 'bg-light-300 text-light-900'
      }`}
      >
        {theme === 'system' 
          ? t("system") 
          : (resolvedTheme === 'dark' ? t("dark") : t("light"))}
      </span>
    </div>
  );
} 