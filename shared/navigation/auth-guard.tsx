import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectAuth } from '@/features/auth/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    const segmentsArray = segments as string[];
    const isOnAuthScreen = segmentsArray.includes('(auth)');

    if (!user && !isAuthenticated && !isOnAuthScreen) {
      router.replace('/(auth)/welcome');
    }
  }, [user, isAuthenticated, segments, router]);

  return <>{children}</>;
}
