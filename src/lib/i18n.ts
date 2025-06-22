import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 僅在客戶端初始化 i18n
if (typeof window !== 'undefined') {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'zh',
      lng: 'zh', // 預設使用中文
      debug: process.env.NODE_ENV === 'development',
      
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },

      interpolation: {
        escapeValue: false,
      },
    });
} else {
  // 服務端初始化（避免載入檔案導致錯誤）
  i18n.use(initReactI18next).init({
    fallbackLng: 'zh',
    lng: 'zh',
    resources: {
      zh: {
        translation: {}
      },
      en: {
        translation: {}
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n; 