'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // 實際應用的主題
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 在客戶端檢測初始主題
function getInitialTheme(): Theme {
  // 在服務器端渲染期間返回預設值
  if (typeof window === 'undefined') return 'system';
  
  try {
    // 檢查 localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
      return storedTheme;
    }
    
    // 沒有存儲的設置時，預設為跟隨系統
    return 'system';
  } catch (err) {
    return 'system';
  }
}

// 從主題設置解析實際主題
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  
  // 如果是系統設置，檢查系統偏好
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 為了避免 hydration 錯誤，初始使用 'system'，然後在客戶端再更新
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // 只在客戶端運行的效果
  useEffect(() => {
    setMounted(true);
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    setResolvedTheme(resolveTheme(initialTheme));
  }, []);

  // 處理初始化邏輯，確保 DOM 和 state 一致
  useEffect(() => {
    if (!mounted) return;
    
    // 檢查用戶系統偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 檢查本地存儲
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // 設置初始主題
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
      setThemeState(storedTheme);
      const actualTheme = resolveTheme(storedTheme);
      setResolvedTheme(actualTheme);
    } else {
      // 新的預設行為：跟隨系統
      setThemeState('system');
      const actualTheme = prefersDark ? 'dark' : 'light';
      setResolvedTheme(actualTheme);
      localStorage.setItem('theme', 'system');
    }

    // 監聽系統主題變更
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有當設置為跟隨系統時才更新
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // 同步主題變更到 DOM
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme, mounted]);

  // 設置主題
  const setTheme = (newTheme: Theme) => {
    if (!mounted) return;
    
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(newTheme);
    }
  };

  // 切換主題
  const toggleTheme = () => {
    if (!mounted) return;
    
    if (theme === 'system') {
      // 如果當前是跟隨系統，切換到明確的淺色/深色
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      // 在淺色/深色之間切換
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  // 提供一個空值作為 provider 的 value 直到客戶端掛載完成
  // 這是避免 hydration 錯誤的關鍵
  const value = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用主題的自定義 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 