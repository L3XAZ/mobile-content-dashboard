import * as Keychain from 'react-native-keychain';

const PIN_SERVICE = 'pin';
const TOKEN_SERVICE = 'token';

export const getPin = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: PIN_SERVICE,
    });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
};

export const setPin = async (pin: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(PIN_SERVICE, pin, {
      service: PIN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to save PIN: ${error}`);
  }
};

export const deletePin = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: PIN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to delete PIN: ${error}`);
  }
};

const ACCESS_TOKEN_SERVICE = 'accessToken';
const REFRESH_TOKEN_SERVICE = 'refreshToken';

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: ACCESS_TOKEN_SERVICE,
    });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
};

export const setAccessToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(ACCESS_TOKEN_SERVICE, token, {
      service: ACCESS_TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to save access token: ${error}`);
  }
};

export const deleteAccessToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: ACCESS_TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to delete access token: ${error}`);
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
};

export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_SERVICE, token, {
      service: REFRESH_TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to save refresh token: ${error}`);
  }
};

export const deleteRefreshToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to delete refresh token: ${error}`);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(TOKEN_SERVICE, token, {
      service: TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to save token: ${error}`);
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to delete token: ${error}`);
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword();
    await Keychain.resetGenericPassword({
      service: PIN_SERVICE,
    });
    await Keychain.resetGenericPassword({
      service: TOKEN_SERVICE,
    });
    await Keychain.resetGenericPassword({
      service: ACCESS_TOKEN_SERVICE,
    });
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
  } catch (error) {
    throw new Error(`Failed to clear all: ${error}`);
  }
};
