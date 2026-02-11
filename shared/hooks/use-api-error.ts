import { useCallback, useState } from 'react';

import { extractApiErrorMessage } from '@/shared/utils';

export const useApiError = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setApiError(null);
  }, []);

  const handleApiError = useCallback((error: unknown, defaultMessage: string) => {
    const errorMessage = extractApiErrorMessage(error, defaultMessage);
    setApiError(errorMessage);
  }, []);

  return {
    apiError,
    setApiError,
    clearError,
    handleApiError,
  };
};
