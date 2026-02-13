import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { I18nManager, Pressable } from 'react-native';

import { COLORS } from '@/shared/constants';

type BackButtonProps = {
  onPress: () => void;
  color?: string;
  size?: number;
};

export function BackButton({ onPress, color = COLORS['base-black'], size = 24 }: BackButtonProps) {
  const isRTL = I18nManager.isRTL;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="w-10 h-10 items-center justify-center"
      style={({ pressed }) => ({
        transform: [{ scaleX: isRTL ? -1 : 1 }],
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <MaterialIcons name="chevron-left" size={size} color={color} />
    </Pressable>
  );
}
