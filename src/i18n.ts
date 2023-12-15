import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "@assets/locales/en/translation.json";
import translationPTBR from "@assets/locales/pt-BR/translation.json";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      "pt-BR": {
        translation: translationPTBR,
      },
    },
    // lng: 'pt-BR',
    fallbackLng: "pt-BR",
    saveMissing: true,
    react: {
      bindI18n: "languageChanged loaded",
      nsMode: "default",
    },
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator", "localStorage"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "dash_v6_language",
      caches: ["localStorage"],

    },
  });

export default i18n;
