import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { I18nManager, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useAuth } from '@/features/auth/hooks';
import { selectUser } from '@/features/auth/store';
import {
  useBiometricsAvailability,
  useBiometricsEnabled,
  useBiometricType,
} from '@/features/biometrics/hooks';
import { usePin } from '@/features/pin/hooks';
import { COLORS, PIN_LENGTH } from '@/shared/constants';
import { useTranslation } from '@/shared/i18n';
import { authenticateWithBiometrics, getPin } from '@/shared/security';
import { PinScreenSearchParams } from '@/shared/types/navigation';
import { CreateStep, PinMode } from '@/shared/types/pin';
import { BackButton } from '@/shared/ui/navigation/BackButton';

const PIN_KEY_SIZE = 72;

const pinRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

const normalizePinParams = (params: PinScreenSearchParams): { mode: PinMode; from?: string } => {
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const from = Array.isArray(params.from) ? params.from[0] : params.from;

  return {
    mode: (mode || 'enter') as PinMode,
    from,
  };
};

export default function PinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PinScreenSearchParams>();
  const { logout } = useAuth();
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const { mode: pinMode, from } = normalizePinParams(params);

  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [createStep, setCreateStep] = useState<CreateStep>('create');

  const hasTriedBiometricsRef = useRef(false);

  const { isAvailable: isBiometricsAvailable, isLoading: isAvailabilityLoading } =
    useBiometricsAvailability(user?.id ?? null);

  const { type: biometricType } = useBiometricType();

  const { enabled: biometricsEnabled, isLoading: isEnabledLoading } = useBiometricsEnabled(
    user?.id ?? null
  );

  const { handleContinue, error, isLoading, isProcessing } = usePin(
    { pinMode, user },
    {
      onFirstPinSet: setFirstPin,
      onPinReset: () => setPin(''),
      onFirstPinReset: () => setFirstPin(''),
      onStepChange: setCreateStep,
    }
  );

  const title =
    pinMode === 'create'
      ? createStep === 'create'
        ? t('auth.pin.createTitle')
        : t('auth.pin.repeatTitle')
      : t('auth.pin.enterTitle');

  const subtitle = pinMode === 'enter' ? t('auth.pin.enterSubtitle') : t('auth.pin.createSubtitle');

  useEffect(() => {
    if (pin.length === PIN_LENGTH && !isProcessing && !isLoading) {
      handleContinue(pin, firstPin, createStep);
    }
  }, [pin, firstPin, createStep, isProcessing, isLoading, handleContinue]);

  const handleBiometricAuth = useCallback(async () => {
    if (!user?.id) return;

    const success = await authenticateWithBiometrics();
    if (!success) return;

    try {
      const savedPin = await getPin(user.id.toString());

      if (!savedPin) {
        hasTriedBiometricsRef.current = false;
        return;
      }

      handleContinue(savedPin, '', 'repeat');
    } catch {
      hasTriedBiometricsRef.current = false;
    }
  }, [user?.id, handleContinue]);

  useEffect(() => {
    if (
      pinMode === 'enter' &&
      biometricsEnabled === true &&
      isBiometricsAvailable === true &&
      !hasTriedBiometricsRef.current &&
      !isAvailabilityLoading &&
      !isEnabledLoading &&
      user?.id
    ) {
      hasTriedBiometricsRef.current = true;
      handleBiometricAuth();
    }
  }, [
    pinMode,
    biometricsEnabled,
    isBiometricsAvailable,
    isAvailabilityLoading,
    isEnabledLoading,
    user?.id,
    handleBiometricAuth,
  ]);

  const handleDigitPress = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleBack = () => {
    if (pinMode === 'create') {
      if (createStep === 'create') {
        if (from === 'login') router.replace('/(auth)/login');
        else if (from === 'sign-up') router.replace('/(auth)/sign-up');
        else logout();
      } else {
        setCreateStep('create');
        setPin('');
        setFirstPin('');
      }
    } else {
      logout();
    }
  };

  const handleChangeAccount = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-base-white">
      <View className="px-6 pt-16 pb-8">
        <BackButton onPress={handleBack} />

        <View className="items-center mb-8">
          {pinMode === 'create' ? (
            <MaterialIcons name="lock-outline" size={60} color={COLORS.success} />
          ) : (
            <View className="mb-4">
              <MaterialIcons name="person-outline" size={40} color={COLORS.success} />
            </View>
          )}

          {pinMode === 'enter' && user?.email && (
            <View className="mb-4 items-center">
              <Text className="text-lg font-semibold text-base-black mb-2">{user.email}</Text>
              <TouchableOpacity onPress={handleChangeAccount} activeOpacity={0.7}>
                <Text className="text-sm text-primary font-semibold">
                  {t('auth.pin.changeAccount')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="text-2xl font-bold text-base-black mb-2">{title}</Text>
          <Text className="text-base text-gray-text">{subtitle}</Text>
        </View>

        {error && (
          <View className="bg-error/10 border border-error rounded-xl p-3 mb-6 flex-row items-center">
            <MaterialIcons name="info" size={20} color={COLORS.error} />
            <Text
              className="text-sm text-error flex-1"
              style={isRTL ? { marginRight: 8 } : { marginLeft: 8 }}
            >
              {error}
            </Text>
          </View>
        )}

        <View className="flex-row justify-center items-center gap-4 mb-6">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <View
              key={index}
              className={`w-6 h-6 rounded-full border-2 ${
                index < pin.length
                  ? 'bg-primary border-primary'
                  : 'border-gray-light bg-transparent'
              }`}
            />
          ))}
        </View>

        <View className="items-center mb-8 gap-3">
          {pinRows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((digit) => (
                <TouchableOpacity
                  key={digit}
                  onPress={() => handleDigitPress(digit)}
                  disabled={pin.length >= PIN_LENGTH || isLoading}
                  className="items-center justify-center bg-base-white rounded-2xl border border-gray-light"
                  style={{ width: PIN_KEY_SIZE, height: PIN_KEY_SIZE }}
                  activeOpacity={0.7}
                >
                  <Text className="text-2xl font-semibold text-base-black">{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleDigitPress('0')}
              disabled={pin.length >= PIN_LENGTH || isLoading}
              className="items-center justify-center bg-base-white rounded-2xl border border-gray-light"
              style={{ width: PIN_KEY_SIZE, height: PIN_KEY_SIZE }}
              activeOpacity={0.7}
            >
              <Text className="text-2xl font-semibold text-base-black">0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBackspace}
              disabled={pin.length === 0 || isLoading}
              className="items-center justify-center bg-base-white rounded-2xl border border-gray-light"
              style={{ width: PIN_KEY_SIZE, height: PIN_KEY_SIZE }}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="backspace"
                size={24}
                color={pin.length > 0 ? COLORS['base-black'] : COLORS['gray-placeholder']}
              />
            </TouchableOpacity>
          </View>
        </View>

        {pinMode === 'enter' && biometricsEnabled === true && isBiometricsAvailable === true && (
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center justify-center mb-14"
            onPress={handleBiometricAuth}
            activeOpacity={0.8}
          >
            <Text className="text-base-white text-lg font-semibold">
              {biometricType === 'faceid'
                ? t('auth.pin.useFaceId')
                : biometricType === 'fingerprint'
                  ? t('auth.pin.useFingerprint')
                  : t('auth.pin.useBiometrics')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}