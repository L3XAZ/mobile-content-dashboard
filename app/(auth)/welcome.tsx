import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-base-white">
      <View className="flex-1 px-6 pt-16 pb-8 min-h-screen">
        <View className="mb-12">
          <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-8">
            <Text className="text-6xl text-base-white">₿</Text>
          </View>
        </View>

        <View className="mb-12">
          <Text className="text-3xl font-bold text-base-black mb-2">{t('auth.welcome.title')}</Text>
          <Text className="text-base text-gray-text">{t('auth.welcome.subtitle')}</Text>
        </View>

        <View className="mb-8">
          <View className="flex-row flex-wrap gap-4 mb-4">
            <View className="w-[48%] h-32 bg-primary rounded-2xl items-center justify-center">
              <Text className="text-4xl text-base-white mb-2">₿</Text>
              <Text className="text-sm text-base-white font-semibold">
                {t('auth.welcome.bitcoin')}
              </Text>
            </View>
            <View className="w-[48%] h-32 bg-blue-500 rounded-2xl items-center justify-center">
              <MaterialIcons name="business" size={32} color="#FFFFFF" />
              <Text className="text-sm text-base-white font-semibold mt-2">
                {t('auth.welcome.etfs')}
              </Text>
            </View>
            <View className="w-[48%] h-32 bg-green-500 rounded-2xl items-center justify-center">
              <MaterialIcons name="people" size={32} color="#FFFFFF" />
              <Text className="text-sm text-base-white font-semibold mt-2">
                {t('auth.welcome.crowdLending')}
              </Text>
            </View>
            <View className="w-[48%] h-32 bg-yellow-500 rounded-2xl items-center justify-center">
              <MaterialIcons name="bolt" size={32} color="#FFFFFF" />
              <Text className="text-sm text-base-white font-semibold mt-2">
                {t('auth.welcome.commodities')}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-auto gap-4">
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center justify-center"
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.welcome.signIn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center justify-center"
            onPress={() => router.replace('/(auth)/sign-up')}
            activeOpacity={0.8}
          >
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.welcome.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
