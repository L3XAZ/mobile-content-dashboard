import axios, { AxiosInstance } from 'axios';

import { setupInterceptors } from './interceptors';

const API_BASE_URL = 'https://dummyjson.com';
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
