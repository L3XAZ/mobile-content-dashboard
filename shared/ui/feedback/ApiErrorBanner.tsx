import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { I18nManager, Text, View } from 'react-native';

import { COLORS } from '@/shared/constants';

interface ApiErrorBannerProps {
  error: string | null;
}

export const ApiErrorBanner = ({ error }: ApiErrorBannerProps) => {
  if (!error) {
    return null;
  }

  const isRTL = I18nManager.isRTL;

  return (
    <View className="bg-error/10 border border-error rounded-xl p-3 mb-6 flex-row items-center">
      <MaterialIcons name="info" size={20} color={COLORS.error} />
      <Text
        className="text-sm text-error flex-1"
        style={isRTL ? { marginRight: 8 } : { marginLeft: 8 }}
      >
        {error}
      </Text>
    </View>
  );
};
