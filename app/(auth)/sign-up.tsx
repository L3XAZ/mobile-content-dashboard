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
import { parseName } from '@/shared/utils';
import { createSignUpSchema } from '@/shared/validation';

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

export default function SignUpScreen() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useTranslation();
  const { apiError, clearError, handleApiError } = useApiError();
  const [isLoading, setIsLoading] = useState(false);

  const signUpSchema = createSignUpSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      clearError();
      const { firstName, lastName } = parseName(data.name);

      await registerUser({
        firstName,
        lastName,
        email: data.email,
        username: data.username,
        password: data.password,
      });
    } catch (error: unknown) {
      handleApiError(error, t('auth.signUp.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      onBack={() => safeGoBack(router, '/(auth)/welcome')}
      bottomLinkLabel={t('auth.signUp.hasAccount')}
      bottomLinkText={t('auth.signUp.signIn')}
      bottomLinkAction={() => router.replace('/(auth)/login')}
      header={
        <View className="bg-base-white rounded-3xl p-6 mb-6">
          <View className="flex-row items-center">
            <View className="mr-3">
              <MaterialIcons name="person-outline" size={40} color={COLORS.success} />
            </View>
            <View>
              <Text className="text-2xl font-bold text-base-black">{t('auth.signUp.title')}</Text>
              <Text className="text-sm text-gray-text">{t('auth.signUp.subtitle')}</Text>
            </View>
          </View>
        </View>
      }
    >
      <ApiErrorBanner error={apiError} />

      <View className="bg-base-white rounded-3xl p-6 mb-6">
        <FormField
          label={t('auth.signUp.name')}
          error={errors.name?.message}
          showErrorIcon={!!(errors.name || apiError)}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-2xl px-4 py-3 pr-12 text-base ${
                  errors.name || apiError ? 'border-error' : 'border-gray-light'
                }`}
                placeholder={t('auth.signUp.namePlaceholder')}
                placeholderTextColor={COLORS['gray-placeholder']}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
            )}
          />
        </FormField>

        <FormField
          label={t('auth.signUp.username')}
          error={errors.username?.message}
          showErrorIcon={!!(errors.username || apiError)}
        >
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-2xl px-4 py-3 pr-12 text-base ${
                  errors.username || apiError ? 'border-error' : 'border-gray-light'
                }`}
                placeholder={t('auth.signUp.usernamePlaceholder')}
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
          label={t('auth.signUp.email')}
          error={errors.email?.message}
          showErrorIcon={!!(errors.email || apiError)}
        >
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-2xl px-4 py-3 pr-12 text-base ${
                  errors.email || apiError ? 'border-error' : 'border-gray-light'
                }`}
                placeholder={t('auth.signUp.emailPlaceholder')}
                placeholderTextColor={COLORS['gray-placeholder']}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
        </FormField>

        <FormField
          label={t('auth.signUp.password')}
          error={errors.password?.message}
          showErrorIcon={false}
        >
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('auth.signUp.passwordPlaceholder')}
                placeholderTextColor={COLORS['gray-placeholder']}
                hasError={!!(errors.password || apiError)}
              />
            )}
          />
        </FormField>

        <TouchableOpacity
          className={`bg-primary rounded-2xl py-4 items-center justify-center mt-4 ${
            (!isValid || isLoading) && 'opacity-50'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS['base-white']} />
          ) : (
            <Text className="text-base-white text-lg font-semibold">
              {t('auth.signUp.continue')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </AuthFormLayout>
  );
}
