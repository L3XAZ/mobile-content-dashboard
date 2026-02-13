import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import {
  deleteAccessToken,
  deleteRefreshToken,
  deletePin,
  getPin,
  setAccessToken,
  setRefreshToken,
} from '@/shared/security';
import { AppDispatch } from '@/shared/store';
import { PinScreenParams } from '@/shared/types/navigation';

import { login as loginApi, register as registerApi } from '../api';
import { clearAuth, selectIsAuthenticated, selectUser, setAuth } from '../store';
import { RegisterRequest, User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await loginApi({ username, password });

    try {
      await setAccessToken(response.accessToken);
    } catch {}

    try {
      await setRefreshToken(response.refreshToken);
    } catch {}

    const userData: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      image: response.image,
      gender: response.gender,
    };

    dispatch(setAuth({ user: userData }));

    const pin = await getPin(userData.id.toString());

    if (!pin) {
      router.replace({
        pathname: '/(auth)/pin',
        params: { mode: 'create', from: 'login' } as PinScreenParams,
      });
    } else {
      router.replace({
        pathname: '/(auth)/pin',
        params: { mode: 'enter', from: 'login' } as PinScreenParams,
      });
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    const response = await registerApi(data);

    const userData: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      image: response.image,
      gender: response.gender,
    };

    dispatch(setAuth({ user: userData }));

    router.replace({
      pathname: '/(auth)/pin',
      params: { mode: 'create', from: 'sign-up' } as PinScreenParams,
    });
  };

  const logout = (): void => {
    const userId = user?.id;

    dispatch(clearAuth());

    if (userId !== undefined) {
      deletePin(userId.toString()).catch(() => {});
    }

    deleteAccessToken().catch(() => {});
    deleteRefreshToken().catch(() => {});

    router.replace('/(auth)/welcome');
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
