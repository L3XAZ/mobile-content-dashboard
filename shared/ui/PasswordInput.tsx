import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/shared/constants';

interface PasswordInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  placeholderTextColor: string;
  hasError?: boolean;
  isDisabled?: boolean;
}

export const PasswordInput = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  placeholderTextColor,
  hasError = false,
  isDisabled = false,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TextInput
        className={`border rounded-2xl px-4 py-3 pr-20 text-base ${
          hasError ? 'border-error' : 'border-gray-light'
        }`}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isDisabled}
      />
      <View className="absolute right-4 top-0 bottom-0 flex-row items-center gap-2">
        {hasError && (
          <View className="w-5 h-5 bg-error rounded-full items-center justify-center">
            <Text className="text-xs text-base-white font-bold">i</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          activeOpacity={0.7}
          disabled={isDisabled}
        >
          <MaterialIcons
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
