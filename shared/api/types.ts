export type { ApiError } from '@/shared/types/errors';

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}
