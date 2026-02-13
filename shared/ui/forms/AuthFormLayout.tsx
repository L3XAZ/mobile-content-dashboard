import { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { BackButton } from '@/shared/ui/navigation';

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
    <ScrollView className="flex-1 bg-gray-light" contentContainerClassName="flex-grow">
      <View className="px-6 pt-16 pb-8 flex-1">
        <View className="mb-6">
          <BackButton onPress={onBack} />
        </View>

        {header && <View className="mb-6">{header}</View>}

        <View className="mb-6">{children}</View>

        <View className="flex-row justify-center items-center gap-3">
          <Text className="text-base text-gray-text">{bottomLinkLabel}</Text>

          <TouchableOpacity onPress={bottomLinkAction} activeOpacity={0.7}>
            <Text className="text-base text-primary font-semibold">{bottomLinkText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
