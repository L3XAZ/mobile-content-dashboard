import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/shared/security';

import { ApiError } from './types';

const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
};

const clearTokens = async (): Promise<void> => {
  try {
    await deleteAccessToken();
    await deleteRefreshToken();
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

const refreshAuthLogic = async (failedRequest: AxiosError): Promise<string> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const refreshClient = axios.create({
      baseURL: 'https://dummyjson.com',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const response = await refreshClient.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    await saveTokens(newAccessToken, newRefreshToken);

    if (failedRequest.response?.config) {
      failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return newAccessToken;
  } catch (error) {
    await clearTokens();
    throw error;
  }
};

export const setupInterceptors = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: error.message || 'An error occurred',
        status: error.response?.status,
        data: error.response?.data,
      };

      if (error.response?.status === 401) {
        clearTokens();
      }

      return Promise.reject(apiError);
    }
  );

  createAuthRefreshInterceptor(client, refreshAuthLogic, {
    statusCodes: [401],
    skipWhileRefreshing: true,
  });
};
