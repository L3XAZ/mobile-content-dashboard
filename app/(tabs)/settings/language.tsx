import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { changeLanguage } from '@/shared/i18n';
import { useTranslation } from '@/shared/i18n';
import { COLORS } from '@/shared/constants';

type LanguageOption = {
  code: 'en' | 'ar';
  labelKey: string;
};

export default function LanguageScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();

  const languages: LanguageOption[] = [
    { code: 'en', labelKey: 'language.english' },
    { code: 'ar', labelKey: 'language.arabic' },
  ];

  return (
    <View className="flex-1 bg-base-white px-4 pt-12">
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
        </Pressable>

        <Text className="text-xl font-bold text-base-black ml-2">{t('language.title')}</Text>
      </View>

      <View className="space-y-4">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;

          return (
            <Pressable
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              className="border border-gray-light rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <MaterialIcons name="language" size={20} color={COLORS.primary} />
                <Text className="text-base-black ml-3">{t(lang.labelKey)}</Text>
              </View>

              {isActive ? (
                <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
              ) : (
                <View className="w-6 h-6 rounded-full border border-gray-light" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
