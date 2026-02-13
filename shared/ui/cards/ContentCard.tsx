import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

type ContentCardProps = {
  header?: ReactNode;
  body: ReactNode;
  bodyTone?: 'primary' | 'secondary';
  onPress?: () => void;
};

export function ContentCard({ header, body, bodyTone = 'secondary', onPress }: ContentCardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper className="bg-base-white rounded-3xl p-5" onPress={onPress}>
      {header && (
        <View className="mb-2">
          {typeof header === 'string' ? (
            <Text className="text-base-black font-semibold text-base">{header}</Text>
          ) : (
            header
          )}
        </View>
      )}

      {typeof body === 'string' ? (
        <Text
          className={bodyTone === 'primary' ? 'text-base-black text-sm' : 'text-gray-text text-sm'}
        >
          {body}
        </Text>
      ) : (
        body
      )}
    </Wrapper>
  );
}
