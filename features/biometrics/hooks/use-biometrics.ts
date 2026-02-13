import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getBiometricType,
  getBiometricsEnabled,
  isBiometricsAvailable,
  setBiometricsEnabled,
} from '@/shared/security';

export const useBiometricsAvailability = (userId: string | number | null) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId === null) {
      setIsAvailable(false);
      setIsLoading(false);
      return;
    }

    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const available = await isBiometricsAvailable();
        setIsAvailable(available);
      } catch {
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [userId]);

  return { isAvailable, isLoading };
};

export const useBiometricType = () => {
  const [type, setType] = useState<'faceid' | 'fingerprint' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkType = async () => {
      setIsLoading(true);
      try {
        const biometricType = await getBiometricType();
        setType(biometricType);
      } catch {
        setType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkType();
  }, []);

  return { type, isLoading };
};

export const useBiometricsEnabled = (userId: string | number | null) => {
  const [enabled, setEnabledState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const prevUserIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (prevUserIdRef.current !== userId) {
      setEnabledState(false);
      prevUserIdRef.current = userId;
    }

    if (userId === null) {
      setIsLoading(false);
      return;
    }

    const checkEnabled = async () => {
      setIsLoading(true);
      try {
        const isEnabled = await getBiometricsEnabled(userId);
        setEnabledState(isEnabled);
      } catch {
        setEnabledState(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnabled();
  }, [userId]);

  const setEnabled = useCallback(
    async (newEnabled: boolean) => {
      if (userId === null) {
        return;
      }

      try {
        await setBiometricsEnabled(userId, newEnabled);
        setEnabledState(newEnabled);
      } catch {}
    },
    [userId]
  );

  return { enabled, isLoading, setEnabled };
};