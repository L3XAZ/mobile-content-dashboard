import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectUser } from '@/features/auth/store';
import { getPin } from '@/shared/security';
import { PinScreenParams } from '@/shared/types/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const segmentsArray = segments as string[];
    const isOnAuthScreen = segmentsArray.includes('(auth)');
    const isOnPinScreen = segmentsArray.includes('pin');
    const isOnTabsScreen = segmentsArray.includes('(tabs)');

    if (!isAuthenticated) {
      if (!isOnAuthScreen && isMountedRef.current) {
        router.replace('/(auth)/welcome');
      }
    } else {
      if (user?.id && !isOnPinScreen && !isOnTabsScreen && !isOnAuthScreen) {
        const checkPin = async () => {
          if (!isMountedRef.current) {
            return;
          }
          let savedPin: string | null = null;
          try {
            savedPin = await getPin(user.id.toString());
          } catch {}
          if (!isMountedRef.current) {
            return;
          }
          if (!savedPin) {
            if (isMountedRef.current) {
              router.replace({
                pathname: '/(auth)/pin',
                params: { mode: 'create', from: 'restart' } as PinScreenParams,
              });
            }
          } else {
            if (isMountedRef.current) {
              router.replace({
                pathname: '/(auth)/pin',
                params: { mode: 'enter', from: 'restart' } as PinScreenParams,
              });
            }
          }
        };
        checkPin();
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, user?.id, segments, router]);

  return <>{children}</>;
}
