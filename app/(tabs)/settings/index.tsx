import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useAuth } from '@/features/auth/hooks';
import { selectUser } from '@/features/auth/store';
import { COLORS } from '@/shared/constants';
import { useTranslation } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/navigation/BackButton';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const { logout } = useAuth();
  const { t } = useTranslation();

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.username ?? '—');

  return (
    <View className="flex-1 bg-base-white">
      <View className="px-4 pt-14 pb-4">
        <View className="flex-row items-center mb-4">
          <BackButton onPress={() => router.back()} />
          <Text className="text-2xl font-bold text-base-black ms-3">{t('settings.title')}</Text>
        </View>
      </View>

      <View className="px-4">
        <View className="border border-gray-light rounded-3xl p-5 flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-gray-light me-3" />
          <Text className="text-base-black font-semibold">{userName}</Text>
        </View>

        <Text className="text-gray-text text-sm mb-2">{t('settings.basic')}</Text>

        <Pressable
          onPress={() => router.push('/(tabs)/settings/language')}
          className="border border-gray-light rounded-3xl p-5 flex-row items-center justify-between mb-6"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="language" size={20} color={COLORS.primary} />
            <Text className="text-base-black ms-3">{t('settings.language')}</Text>
          </View>

          <MaterialIcons name="chevron-right" size={24} color={COLORS['gray-icon']} />
        </Pressable>

        <Text className="text-gray-text text-sm mb-2">{t('settings.other')}</Text>

        <Pressable
          onPress={logout}
          className="border border-gray-light rounded-3xl p-5 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={20} color={COLORS.error} />
            <Text className="text-error ms-3">{t('settings.logout')}</Text>
          </View>

          <MaterialIcons name="chevron-right" size={24} color={COLORS['gray-icon']} />
        </Pressable>
      </View>
    </View>
  );
}
