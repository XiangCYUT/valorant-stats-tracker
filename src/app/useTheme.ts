"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(true);

  // 初始化主題 - 先讀取系統顏色，但也檢查是否有手動設置
  useEffect(() => {
    // 檢查是否有儲存的主題設置
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark") {
      setIsDark(true);
      setIsSystemTheme(false);
      document.documentElement.classList.add("dark");
    } else if (storedTheme === "light") {
      setIsDark(false);
      setIsSystemTheme(false);
      document.documentElement.classList.remove("dark");
    } else {
      // 沒有手動設置時，使用系統偏好
      setIsDark(prefersDark);
      setIsSystemTheme(true);
      
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // 監聽系統主題變化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只在使用系統主題時響應變化
      if (isSystemTheme) {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme]);

  // 切換主題
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setIsSystemTheme(false);  // 手動切換後不再跟隨系統
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 重設為系統主題
  const resetToSystemTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    setIsSystemTheme(true);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.removeItem("theme");
  };

  return {
    isDark,
    isSystemTheme,
    toggleTheme,
    resetToSystemTheme
  };
} 