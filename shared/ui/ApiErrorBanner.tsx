import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { COLORS } from '@/shared/constants';

interface ApiErrorBannerProps {
  error: string | null;
}

export const ApiErrorBanner = ({ error }: ApiErrorBannerProps) => {
  if (!error) {
    return null;
  }

  return (
    <View className="bg-error/10 border border-error rounded-xl p-3 mb-6 flex-row items-center">
      <MaterialIcons name="info" size={20} color={COLORS.error} />
      <Text className="text-sm text-error flex-1 ml-2">{error}</Text>
    </View>
  );
};
