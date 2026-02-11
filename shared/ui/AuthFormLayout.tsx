import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/shared/constants';

interface AuthFormLayoutProps {
  header?: ReactNode;
  onBack: () => void;
  children: ReactNode;
  bottomLinkText: string;
  bottomLinkAction: () => void;
  bottomLinkLabel: string;
}

export function AuthFormLayout({
  header,
  onBack,
  children,
  bottomLinkText,
  bottomLinkAction,
  bottomLinkLabel,
}: AuthFormLayoutProps) {
  return (
    <ScrollView className="flex-1 bg-gray-light">
      <View className="px-6 pt-16 pb-8">
        <View className="mb-6">
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 items-center justify-center mb-6"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
          </TouchableOpacity>
        </View>

        {header}
        {children}

        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-base text-gray-text">{bottomLinkLabel} </Text>
          <TouchableOpacity onPress={bottomLinkAction} activeOpacity={0.7}>
            <Text className="text-base text-primary font-semibold">{bottomLinkText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
