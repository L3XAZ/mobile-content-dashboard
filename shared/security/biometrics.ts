import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const isBiometricsAvailable = async (): Promise<boolean> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return false;
    }
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  } catch {
    return false;
  }
};

export const getBiometricType = async (): Promise<'faceid' | 'fingerprint' | null> => {
  try {
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'faceid';
    }
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'fingerprint';
    }
    return null;
  } catch {
    return null;
  }
};

export const authenticateWithBiometrics = async (promptMessage?: string): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage || 'Authenticate to continue',
    });
    return result.success === true;
  } catch {
    return false;
  }
};

export const getBiometricsEnabled = async (userId: string | number): Promise<boolean> => {
  const key = `biometrics_${userId}`;
  try {
    const value = await AsyncStorage.getItem(key);
    return value === 'true';
  } catch {
    return false;
  }
};

export const setBiometricsEnabled = async (
  userId: string | number,
  enabled: boolean
): Promise<void> => {
  const key = `biometrics_${userId}`;
  try {
    await AsyncStorage.setItem(key, enabled ? 'true' : 'false');
  } catch {}
};
