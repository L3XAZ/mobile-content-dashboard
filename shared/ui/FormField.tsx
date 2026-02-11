import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  showErrorIcon?: boolean;
  labelRight?: ReactNode;
}

export const FormField = ({
  label,
  error,
  children,
  showErrorIcon = true,
  labelRight,
}: FormFieldProps) => {
  return (
    <View className="mb-4">
      {labelRight ? (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-base-black">{label}</Text>
          {labelRight}
        </View>
      ) : (
        <Text className="text-sm font-semibold text-base-black mb-2">{label}</Text>
      )}
      <View className="relative">
        {children}
        {showErrorIcon && error && (
          <View className="absolute right-4 top-0 bottom-0 justify-center">
            <View className="w-5 h-5 bg-error rounded-full items-center justify-center">
              <Text className="text-xs text-base-white font-bold">i</Text>
            </View>
          </View>
        )}
      </View>
      {error && <Text className="text-sm text-error mt-1">{error}</Text>}
    </View>
  );
};
