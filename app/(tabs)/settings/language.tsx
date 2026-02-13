import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { COLORS } from '@/shared/constants';
import { changeLanguage, useTranslation } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/navigation/BackButton';

type LanguageCode = 'en' | 'ar';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: t('language.english') },
    { code: 'ar', label: t('language.arabic') },
  ];

  return (
    <View className="flex-1 bg-base-white">
      <View className="px-4 pt-14 pb-4">
        <View className="flex-row items-center mb-4">
          <BackButton onPress={() => router.back()} />
          <Text className="text-2xl font-bold text-base-black ms-3">{t('language.title')}</Text>
        </View>
      </View>

      <View className="px-4">
        <View className="gap-3">
          {languages.map((lang) => {
            const isActive = currentLanguage === lang.code;

            return (
              <Pressable
                key={lang.code}
                onPress={() => changeLanguage(lang.code)}
                className="border border-gray-light rounded-3xl p-5 flex-row items-center justify-between"
              >
                <Text className="text-base-black">{lang.label}</Text>

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
    </View>
  );
}
