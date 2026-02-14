import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { useAuth } from '@/features/auth/hooks';
import { COLORS } from '@/shared/constants';
import { useApiError } from '@/shared/hooks/use-api-error';
import { useTranslation } from '@/shared/i18n';
import { safeGoBack } from '@/shared/navigation/safe-navigation';
import { ApiErrorBanner, AuthFormLayout, FormField, PasswordInput } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { createLoginSchema } from '@/shared/validation';

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const { apiError, clearError, handleApiError } = useApiError();
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      clearError();
      await login(data.username, data.password);
    } catch (error) {
      handleApiError(error, t('auth.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      onBack={() => safeGoBack(router, '/(auth)/welcome')}
      bottomLinkLabel={t('auth.login.noAccount')}
      bottomLinkText={t('auth.login.createAccount')}
      bottomLinkAction={() => router.replace('/(auth)/sign-up')}
      header={
        <View className="bg-base-white rounded-3xl p-6">
          <View className="flex-row items-center">
            <View className="me-3">
              <MaterialIcons name="person-outline" size={40} color={COLORS.success} />
            </View>

            <View>
              <Text className="text-2xl font-bold text-base-black">{t('auth.login.title')}</Text>
              <Text className="text-sm text-gray-text">{t('auth.login.subtitle')}</Text>
            </View>
          </View>
        </View>
      }
    >
      <View className="bg-base-white rounded-3xl p-6">
        <ApiErrorBanner error={apiError} />

        <FormField
          label={t('auth.login.username')}
          error={errors.username?.message}
          showErrorIcon={!!(errors.username || apiError)}
        >
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={cn(
                  'border rounded-2xl px-4 py-3 text-base',
                  errors.username || apiError ? 'border-error' : 'border-gray-light'
                )}
                placeholder={t('auth.login.usernamePlaceholder')}
                placeholderTextColor={COLORS['gray-placeholder']}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
        </FormField>

        <FormField
          label={t('auth.login.password')}
          error={errors.password?.message}
          showErrorIcon={false}
          labelRight={
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-sm text-primary font-semibold">{t('auth.login.forgot')}</Text>
            </TouchableOpacity>
          }
        >
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('auth.login.passwordPlaceholder')}
                placeholderTextColor={COLORS['gray-placeholder']}
                hasError={!!(errors.password || apiError)}
              />
            )}
          />
        </FormField>

        <TouchableOpacity
          className={cn(
            'bg-primary rounded-2xl py-4 items-center justify-center mt-6',
            (!isValid || isLoading) && 'opacity-50'
          )}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS['base-white']} />
          ) : (
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.login.continue')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </AuthFormLayout>
  );
}
