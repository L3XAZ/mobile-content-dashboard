import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useAuth } from '@/features/auth/hooks';
import { selectUser } from '@/features/auth/store';
import { usePin } from '@/features/pin/hooks';
import { COLORS, PIN_LENGTH } from '@/shared/constants';
import { useTranslation } from '@/shared/i18n';
import { PinScreenSearchParams } from '@/shared/types/navigation';

type PinMode = 'create' | 'enter';
type CreateStep = 'create' | 'repeat';

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

  const { mode: pinMode, from } = normalizePinParams(params);

  const [pin, setPinValue] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [createStep, setCreateStep] = useState<CreateStep>('create');

  const { handleContinue, error, isLoading, isProcessing } = usePin(
    { pinMode, user },
    {
      onFirstPinSet: (pinValue) => setFirstPin(pinValue),
      onPinReset: () => setPinValue(''),
      onFirstPinReset: () => setFirstPin(''),
      onStepChange: (step) => setCreateStep(step),
    }
  );

  const handleContinueClick = () => {
    handleContinue(pin, firstPin, createStep);
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH && !isProcessing && !isLoading) {
      handleContinue(pin, firstPin, createStep);
    }
  }, [pin, firstPin, createStep, isProcessing, isLoading, handleContinue]);

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (pin.length < PIN_LENGTH) {
        setPinValue(pin + digit);
      }
    },
    [pin]
  );

  const handleBackspace = useCallback(() => {
    if (pin.length > 0) {
      setPinValue(pin.slice(0, -1));
    }
  }, [pin]);

  const handleChangeAccount = (): void => {
    logout();
    router.replace('/(auth)/login');
  };

  const getTitle = () => {
    if (pinMode === 'create') {
      return createStep === 'create' ? t('auth.pin.createTitle') : t('auth.pin.repeatTitle');
    }
    return t('auth.pin.enterTitle');
  };

  const getSubtitle = () => {
    if (pinMode === 'enter') {
      return t('auth.pin.enterSubtitle');
    }
    return t('auth.pin.createSubtitle');
  };

  const renderPinIndicators = () => {
    return (
      <View className="flex-row justify-center items-center gap-4 mb-8">
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <View
            key={index}
            className={`w-6 h-6 rounded-full border-2 ${
              index < pin.length ? 'bg-primary border-primary' : 'border-gray-light bg-transparent'
            }`}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    return (
      <View className="mb-6">
        <View className="flex-row flex-wrap justify-center gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => handleDigitPress(num.toString())}
              disabled={pin.length >= PIN_LENGTH || isLoading}
              className="w-20 h-20 bg-base-white rounded-2xl items-center justify-center border border-gray-light"
              activeOpacity={0.7}
            >
              <Text className="text-2xl font-semibold text-base-black">{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-center items-center gap-4">
          <TouchableOpacity
            onPress={() => handleDigitPress('0')}
            disabled={pin.length >= PIN_LENGTH || isLoading}
            className="w-20 h-20 bg-base-white rounded-2xl items-center justify-center border border-gray-light"
            activeOpacity={0.7}
          >
            <Text className="text-2xl font-semibold text-base-black">0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBackspace}
            disabled={pin.length === 0 || isLoading}
            className="w-20 h-20 bg-base-white rounded-2xl items-center justify-center border border-gray-light"
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
    );
  };

  return (
    <ScrollView className="flex-1 bg-base-white">
      <View className="px-6 pt-16 pb-8">
        {pinMode === 'create' && (
          <TouchableOpacity
            onPress={() => {
              if (createStep === 'create') {
                if (from === 'login') {
                  router.replace('/(auth)/login');
                } else if (from === 'sign-up') {
                  router.replace('/(auth)/sign-up');
                } else {
                  logout();
                }
              } else {
                setCreateStep('create');
                setPinValue('');
                setFirstPin('');
              }
            }}
            className="w-10 h-10 items-center justify-center mb-6"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
          </TouchableOpacity>
        )}

        {pinMode === 'enter' && (
          <TouchableOpacity
            onPress={() => {
              logout();
            }}
            className="w-10 h-10 items-center justify-center mb-6"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
          </TouchableOpacity>
        )}

        <View className="items-center mb-8">
          {pinMode === 'create' ? (
            <MaterialIcons name="lock-outline" size={60} color={COLORS.success} />
          ) : (
            <View className="mb-4">
              <MaterialIcons name="person-outline" size={40} color={COLORS.success} />
            </View>
          )}

          {pinMode === 'enter' && user?.email && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-base-black mb-2">{user.email}</Text>
              <TouchableOpacity onPress={handleChangeAccount} activeOpacity={0.7}>
                <Text className="text-sm text-primary font-semibold">
                  {t('auth.pin.changeAccount')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="text-2xl font-bold text-base-black mb-2">{getTitle()}</Text>
          <Text className="text-base text-gray-text">{getSubtitle()}</Text>
        </View>

        {error && (
          <View className="bg-error/10 border border-error rounded-xl p-3 mb-6 flex-row items-center">
            <MaterialIcons name="info" size={20} color={COLORS.error} />
            <Text className="text-sm text-error flex-1 ml-2">{error}</Text>
          </View>
        )}

        {renderPinIndicators()}

        {renderKeypad()}

        <TouchableOpacity
          className={`bg-primary rounded-2xl py-4 items-center justify-center ${
            (pin.length !== PIN_LENGTH || isLoading) && 'opacity-50'
          }`}
          onPress={handleContinueClick}
          disabled={pin.length !== PIN_LENGTH || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS['base-white']} />
          ) : (
            <Text className="text-base-white text-lg font-semibold">{t('auth.pin.continue')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
