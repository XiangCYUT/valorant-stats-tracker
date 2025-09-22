import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../../public/locales/en/translation.json';
import zhTranslation from '../../public/locales/zh/translation.json';

if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      detection: {
        order: ['navigator', 'cookie', 'localStorage', 'htmlTag'],
        caches: ['cookie', 'localStorage'],
      },
      resources: {
        en: {
          translation: enTranslation
        },
        zh: {
          translation: zhTranslation
        }
      },
      interpolation: {
        escapeValue: false,
      },
    });
} else {
  i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
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