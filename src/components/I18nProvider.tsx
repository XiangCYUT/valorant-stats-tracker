"use client";

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 等待 i18n 完全初始化
    const waitForI18n = async () => {
      if (typeof window !== 'undefined') {
        // 等待 i18n 初始化完成
        await i18n.loadNamespaces('translation');
        
        // 設定預設語言
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
          await i18n.changeLanguage(savedLanguage);
        } else {
          await i18n.changeLanguage('zh');
        }
        
        setIsReady(true);
      }
    };

    // 如果 i18n 已經初始化，直接設置準備完成
    if (i18n.isInitialized) {
      waitForI18n();
    } else {
      // 監聽 i18n 初始化完成事件
      i18n.on('initialized', waitForI18n);
      
      return () => {
        i18n.off('initialized', waitForI18n);
      };
    }
  }, []);

  // 在未準備好時顯示載入狀態
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-light-600 dark:text-light-400">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 