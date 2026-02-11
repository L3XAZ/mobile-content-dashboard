import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const PIN_SERVICE = 'pin';
const ACCESS_TOKEN_SERVICE = 'accessToken';
const REFRESH_TOKEN_SERVICE = 'refreshToken';

const ERROR_SAVE_PIN = 'Failed to save PIN';
const ERROR_DELETE_PIN = 'Failed to delete PIN';
const ERROR_SAVE_ACCESS_TOKEN = 'Failed to save access token';
const ERROR_DELETE_ACCESS_TOKEN = 'Failed to delete access token';
const ERROR_SAVE_REFRESH_TOKEN = 'Failed to save refresh token';
const ERROR_DELETE_REFRESH_TOKEN = 'Failed to delete refresh token';

const isKeychainAvailable = (): boolean => {
  try {
    return (
      Keychain !== null &&
      Keychain !== undefined &&
      typeof Keychain.setGenericPassword === 'function'
    );
  } catch {
    return false;
  }
};

const getSecureValue = async (service: string): Promise<string | null> => {
  if (isKeychainAvailable()) {
    try {
      const credentials = await Keychain.getGenericPassword({
        service,
      });
      return credentials ? credentials.password : null;
    } catch {
      try {
        return await AsyncStorage.getItem(service);
      } catch {
        return null;
      }
    }
  }

  try {
    return await AsyncStorage.getItem(service);
  } catch {
    return null;
  }
};

const setSecureValue = async (
  service: string,
  value: string,
  username: string,
  errorMessage: string
): Promise<void> => {
  if (isKeychainAvailable()) {
    try {
      try {
        await Keychain.resetGenericPassword({
          service,
        });
      } catch {}
      await Keychain.setGenericPassword(username, value, {
        service,
      });
      return;
    } catch {
      try {
        await AsyncStorage.setItem(service, value);
        return;
      } catch (error) {
        throw new Error(`${errorMessage}: ${error}`);
      }
    }
  }

  try {
    await AsyncStorage.setItem(service, value);
  } catch (error) {
    throw new Error(`${errorMessage}: ${error}`);
  }
};

const deleteSecureValue = async (service: string, errorMessage: string): Promise<void> => {
  if (isKeychainAvailable()) {
    try {
      await Keychain.resetGenericPassword({
        service,
      });
      return;
    } catch {
      try {
        await AsyncStorage.removeItem(service);
        return;
      } catch (error) {
        throw new Error(`${errorMessage}: ${error}`);
      }
    }
  }

  try {
    await AsyncStorage.removeItem(service);
  } catch (error) {
    throw new Error(`${errorMessage}: ${error}`);
  }
};

export const getPin = async (userId: string | number): Promise<string | null> => {
  const key = `${PIN_SERVICE}_${userId}`;
  return getSecureValue(key);
};

export const setPin = async (pin: string, userId: string | number): Promise<void> => {
  const key = `${PIN_SERVICE}_${userId}`;
  return setSecureValue(key, pin, 'pin_user', ERROR_SAVE_PIN);
};

export const deletePin = async (userId: string | number): Promise<void> => {
  const key = `${PIN_SERVICE}_${userId}`;
  return deleteSecureValue(key, ERROR_DELETE_PIN);
};

export const getAccessToken = async (): Promise<string | null> => {
  return getSecureValue(ACCESS_TOKEN_SERVICE);
};

export const setAccessToken = async (token: string): Promise<void> => {
  return setSecureValue(ACCESS_TOKEN_SERVICE, token, 'access_token_user', ERROR_SAVE_ACCESS_TOKEN);
};

export const deleteAccessToken = async (): Promise<void> => {
  return deleteSecureValue(ACCESS_TOKEN_SERVICE, ERROR_DELETE_ACCESS_TOKEN);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return getSecureValue(REFRESH_TOKEN_SERVICE);
};

export const setRefreshToken = async (token: string): Promise<void> => {
  return setSecureValue(
    REFRESH_TOKEN_SERVICE,
    token,
    'refresh_token_user',
    ERROR_SAVE_REFRESH_TOKEN
  );
};

export const deleteRefreshToken = async (): Promise<void> => {
  return deleteSecureValue(REFRESH_TOKEN_SERVICE, ERROR_DELETE_REFRESH_TOKEN);
};
