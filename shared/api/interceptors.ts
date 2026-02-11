import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { DUMMYJSON_BASE_URL } from './base-urls';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/shared/security';
import { ApiError, normalizeError } from '@/shared/types/errors';

const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
  } catch {}
};

const clearTokens = async (): Promise<void> => {
  try {
    await deleteAccessToken();
    await deleteRefreshToken();
  } catch {}
};

const refreshAuthLogic = async (failedRequest: AxiosError): Promise<string> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const refreshClient = axios.create({
      baseURL: DUMMYJSON_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const response = await refreshClient.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', {
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
    const apiError: ApiError = normalizeError(error);
    throw apiError;
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
    (error: AxiosError) => {
      const apiError: ApiError = normalizeError(error);
      return Promise.reject(apiError);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let errorMessage = error.message || 'An error occurred';

      if (error.response?.data) {
        const responseData = error.response.data;
        if (typeof responseData === 'object' && responseData !== null) {
          const data = responseData as Record<string, unknown>;
          if ('message' in data && typeof data.message === 'string') {
            errorMessage = data.message;
          } else if ('error' in data && typeof data.error === 'string') {
            errorMessage = data.error;
          }
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
      }

      const errorForNormalization = {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      };

      const apiError: ApiError = normalizeError(errorForNormalization);

      if (error.response?.status !== undefined) {
        apiError.status = error.response.status;
      }
      if (error.response?.data !== undefined) {
        apiError.data = error.response.data;
      }

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
