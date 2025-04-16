import translationKO from './locales/ko/translation.json';
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';
import translationZH from './locales/zh/translation.json';
import translationDE from './locales/de/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';

// 언어별 메타데이터와 번역 정보를 포함하는 객체
const Translation = {
  ko: {
    name: '한국어',
    code: 'ko',
    translation: translationKO,
  },
  en: {
    name: 'English',
    code: 'en',
    translation: translationEN,
  },
  ja: {
    name: '日本語',
    code: 'ja',
    translation: translationJA,
  },
  zh: {
    name: '简体中文',
    code: 'zh',
    translation: translationZH,
  },
  de: {
    name: 'Deutsch',
    code: 'de',
    translation: translationDE,
  },
  fr: {
    name: 'Français',
    code: 'fr',
    translation: translationFR,
  },
  es: {
    name: 'Español',
    code: 'es',
    translation: translationES,
  },
};

// i18next에서 사용할 수 있는 resources 형식으로 변환
export const resources = {
  ko: { translation: translationKO },
  en: { translation: translationEN },
  ja: { translation: translationJA },
  zh: { translation: translationZH },
  de: { translation: translationDE },
  fr: { translation: translationFR },
  es: { translation: translationES },
};

// 지원하는 언어 목록 (UI에서 사용하기 좋은 형태)
export const supportedLanguages = Object.keys(Translation).map((langKey) => {
  return {
    code: langKey,
    name: Translation[langKey].name,
  };
});

export default Translation;
