import axios, { AxiosInstance } from 'axios';

import { setupInterceptors } from './interceptors';
import { DUMMYJSON_BASE_URL, JSONPLACEHOLDER_BASE_URL } from './base-urls';

export { DUMMYJSON_BASE_URL };

export const apiClient: AxiosInstance = axios.create({
  baseURL: DUMMYJSON_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const jsonPlaceholderClient: AxiosInstance = axios.create({
  baseURL: JSONPLACEHOLDER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

setupInterceptors(apiClient);

export default apiClient;
