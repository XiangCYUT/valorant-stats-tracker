import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// 預先匯入翻譯檔案
import enTranslation from '../../public/locales/en/translation.json';
import zhTranslation from '../../public/locales/zh/translation.json';

// 僅在客戶端初始化 i18n
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'zh',
      lng: 'zh', // 預設使用中文
      debug: process.env.NODE_ENV === 'development',
      
      // 使用預先匯入的翻譯資源，而不是通過 HTTP 請求載入
      resources: {
        en: {
          translation: enTranslation
        },
        zh: {
          translation: zhTranslation
        }
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
        translation: zhTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n; 