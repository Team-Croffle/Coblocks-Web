import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '../../../langs/Translation';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(initReactI18next)
  // i18n 초기화
  .init({
    resources,
    fallbackLng: 'ko', // 기본 언어 설정
    debug: true,

    // 언어 감지 옵션
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // XSS 방지가 필요 없는 React
    },
  });

export default i18n;
