import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// import { messages } from './translations/languages/index';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ptbr",
    saveMissing: true,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
