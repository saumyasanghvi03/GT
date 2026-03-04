import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enMessages from '../messages/en.json';
import guMessages from '../messages/gu.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enMessages,
      },
      gu: {
        translation: guMessages,
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'gu'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
