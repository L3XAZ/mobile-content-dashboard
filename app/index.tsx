import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { selectAuth } from '@/features/auth/store';

export default function IndexScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (isAuthenticated) {
      router.replace('/(auth)/pin');
      return;
    }

    router.replace('/(auth)/welcome');
  }, [user, isAuthenticated, router]);

  return (
    <View className="flex-1 items-center justify-center bg-base-white">
      <ActivityIndicator size="large" />
    </View>
  );
}
