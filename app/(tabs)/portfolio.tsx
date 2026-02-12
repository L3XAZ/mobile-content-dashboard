import { View, Text } from 'react-native';
import { useTranslation } from '@/shared/i18n';

export default function PortfolioScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-base-white items-center justify-center px-6">
      <Text className="text-2xl font-bold text-base-black mb-2">{t('portfolio.title')}</Text>

      <Text className="text-gray-text text-center">{t('portfolio.empty')}</Text>
    </View>
  );
}
