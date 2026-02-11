export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const isApiError = (error: unknown): error is ApiError => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as Record<string, unknown>;

  if (!('message' in err) || typeof err.message !== 'string') {
    return false;
  }

  if ('status' in err && err.status !== undefined && typeof err.status !== 'number') {
    return false;
  }

  return true;
};

export const normalizeError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };
    let errorMessage = axiosError.message || 'An error occurred';

    if (axiosError.response?.data) {
      const responseData = axiosError.response.data;
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

    return {
      message: errorMessage,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as Record<string, unknown>;
    return {
      message: typeof err.message === 'string' ? err.message : 'An unknown error occurred',
      status: typeof err.status === 'number' ? err.status : undefined,
      data: err.data,
    };
  }

  if (error && typeof error === 'object' && 'data' in error) {
    const err = error as Record<string, unknown>;
    const data = err.data;

    if (data && typeof data === 'object' && 'message' in data) {
      const dataObj = data as Record<string, unknown>;
      return {
        message:
          typeof dataObj.message === 'string' ? dataObj.message : 'An unknown error occurred',
        status: typeof err.status === 'number' ? err.status : undefined,
        data,
      };
    }
  }

  return {
    message: typeof error === 'string' ? error : 'An unknown error occurred',
  };
};
