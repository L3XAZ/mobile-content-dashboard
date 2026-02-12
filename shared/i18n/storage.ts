import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'app_language';

export const getStoredLanguage = async (): Promise<'en' | 'ar' | null> => {
  const value = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (value === 'en' || value === 'ar') {
    return value;
  }
  return null;
};

export const setStoredLanguage = async (language: 'en' | 'ar'): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
};
