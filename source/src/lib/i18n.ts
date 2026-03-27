import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import da from '../locales/da/translation.json';
import en from '../locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    da: { translation: da },
    en: { translation: en },
  },
  lng: 'da',
  fallbackLng: 'da',
  interpolation: { escapeValue: false },
});

export default i18n;
