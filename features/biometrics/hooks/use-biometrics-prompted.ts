import { getBiometricsPrompted } from '@/shared/security/biometrics';
import { useEffect, useState } from 'react';

export const useBiometricsPrompted = (userId: string | number | null) => {
  const [prompted, setPrompted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!userId) {
        if (active) {
          setPrompted(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const value = await getBiometricsPrompted(userId);
        if (active) {
          setPrompted(value);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [userId]);

  return {
    prompted,
    isLoading,
  };
};
