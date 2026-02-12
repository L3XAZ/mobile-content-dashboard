import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectUser } from '@/features/auth/store';
import { useAuth } from '@/features/auth/hooks';
import { COLORS } from '@/shared/constants';
import { useTranslation } from '@/shared/i18n';

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
    <View className="flex-1 bg-base-white px-4 pt-12">
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
        </Pressable>
        <Text className="text-xl font-bold text-base-black ml-2">{t('settings.title')}</Text>
      </View>

      <View className="border border-gray-light rounded-2xl p-4 mb-6 flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-gray-light mr-3" />
        <Text className="text-base-black font-semibold">{userName}</Text>
      </View>

      <Text className="text-gray-text text-sm mb-2">{t('settings.basic')}</Text>

      <Pressable
        onPress={() => router.push('/(tabs)/settings/language')}
        className="border border-gray-light rounded-2xl px-4 py-4 flex-row items-center justify-between mb-6"
      >
        <View className="flex-row items-center">
          <MaterialIcons name="language" size={20} color={COLORS.primary} />
          <Text className="text-base-black ml-3">{t('settings.language')}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS['gray-icon']} />
      </Pressable>

      <Text className="text-gray-text text-sm mb-2">{t('settings.other')}</Text>

      <Pressable
        onPress={logout}
        className="border border-gray-light rounded-2xl px-4 py-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <MaterialIcons name="logout" size={20} color={COLORS.error} />
          <Text className="text-error ml-3">{t('settings.logout')}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS['gray-icon']} />
      </Pressable>
    </View>
  );
}
