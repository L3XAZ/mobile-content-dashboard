import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { User } from '@/features/auth/types';
import { PIN_LENGTH } from '@/shared/constants';
import i18n from '@/shared/i18n';
import { getPin, isBiometricsAvailable, setBiometricsEnabled, setPin } from '@/shared/security';

type PinMode = 'create' | 'enter';
type CreateStep = 'create' | 'repeat';

interface UsePinParams {
  pinMode: PinMode;
  user: User | null;
}

interface UsePinCallbacks {
  onFirstPinSet: (pin: string) => void;
  onPinReset: () => void;
  onFirstPinReset: () => void;
  onStepChange: (step: CreateStep) => void;
}

export const usePin = ({ pinMode, user }: UsePinParams, callbacks: UsePinCallbacks) => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasShownBiometricsAlertRef = useRef(false);

  const handleContinue = useCallback(
    async (pin: string, firstPin: string, createStep: CreateStep) => {
      if (pin.length !== PIN_LENGTH || isProcessing) {
        return;
      }

      setIsLoading(true);
      setIsProcessing(true);
      setError(null);

      try {
        if (pinMode === 'create') {
          if (createStep === 'create') {
            callbacks.onFirstPinSet(pin);
            callbacks.onPinReset();
            callbacks.onStepChange('repeat');
            hasShownBiometricsAlertRef.current = false;
          } else {
            if (pin === firstPin) {
              if (!user?.id) {
                const errorMessage = i18n.t('auth.pin.userNotFound');
                setError(errorMessage);
                callbacks.onPinReset();
                callbacks.onFirstPinReset();
                callbacks.onStepChange('create');
                return;
              }
              try {
                await setPin(pin, user.id.toString());
                const biometricsAvailable = await isBiometricsAvailable();
                if (biometricsAvailable && !hasShownBiometricsAlertRef.current) {
                  hasShownBiometricsAlertRef.current = true;
                  Alert.alert(
                    i18n.t('auth.pin.enableBiometricsTitle'),
                    i18n.t('auth.pin.enableBiometricsMessage'),
                    [
                      {
                        text: i18n.t('auth.pin.enableBiometricsNotNow'),
                        style: 'cancel',
                        onPress: () => {
                          router.replace('/(tabs)');
                        },
                      },
                      {
                        text: i18n.t('auth.pin.enableBiometricsEnable'),
                        onPress: async () => {
                          await setBiometricsEnabled(user.id.toString(), true);
                          router.replace('/(tabs)');
                        },
                      },
                    ]
                  );
                } else {
                  router.replace('/(tabs)');
                }
              } catch {
                const errorMessage = i18n.t('auth.pin.pinSaveFailed');
                setError(errorMessage);
                callbacks.onPinReset();
                callbacks.onFirstPinReset();
                callbacks.onStepChange('create');
              }
            } else {
              const errorMessage = i18n.t('auth.pin.pinMismatch');
              setError(errorMessage);
              callbacks.onPinReset();
              callbacks.onFirstPinReset();
              callbacks.onStepChange('create');
            }
          }
        } else {
          if (!user?.id) {
            const errorMessage = i18n.t('auth.pin.userNotFound');
            setError(errorMessage);
            callbacks.onPinReset();
            return;
          }
          const savedPin = await getPin(user.id.toString());
          if (savedPin === pin) {
            router.replace('/(tabs)');
          } else {
            const errorMessage = i18n.t('auth.pin.invalidPin');
            setError(errorMessage);
            callbacks.onPinReset();
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : i18n.t('auth.pin.errorOccurred');
        setError(errorMessage);
        if (pinMode === 'create' && createStep === 'repeat') {
          callbacks.onPinReset();
          callbacks.onFirstPinReset();
          callbacks.onStepChange('create');
        } else {
          callbacks.onPinReset();
        }
      } finally {
        setIsLoading(false);
        setIsProcessing(false);
      }
    },
    [pinMode, isProcessing, user?.id, router, callbacks]
  );

  return {
    handleContinue,
    error,
    isLoading,
    isProcessing,
  };
};
