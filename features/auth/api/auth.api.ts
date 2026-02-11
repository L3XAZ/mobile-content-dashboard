import { apiClient } from '@/shared/api';

import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>('/users/add', data);
  return response.data;
};
