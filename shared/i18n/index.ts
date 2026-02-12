import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

import ar from './locales/ar.json';
import en from './locales/en.json';
import { getStoredLanguage, setStoredLanguage } from './storage';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

const applyDirection = async (language: 'en' | 'ar') => {
  const isRTL = language === 'ar';

  if (I18nManager.isRTL === isRTL) {
    return;
  }

  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);

  if (Updates.isEnabled) {
    try {
      await Updates.reloadAsync();
    } catch {}
  }
};

export const initLanguage = async (): Promise<void> => {
  const stored = await getStoredLanguage();
  const language = stored ?? 'en';
  await i18n.changeLanguage(language);
  await applyDirection(language);
};

export const changeLanguage = async (language: 'en' | 'ar'): Promise<void> => {
  await setStoredLanguage(language);
  await i18n.changeLanguage(language);
  await applyDirection(language);
};

export { useTranslation } from './use-translation';
export default i18n;
