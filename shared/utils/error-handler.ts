import { ApiError, normalizeError } from '@/shared/types/errors';

export const extractApiErrorMessage = (error: unknown, defaultMessage: string): string => {
  const normalizedError = normalizeError(error);
  return normalizedError.message || defaultMessage;
};

export const extractApiError = (error: unknown): ApiError => {
  return normalizeError(error);
};
