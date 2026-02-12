import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { usePost, usePostComments } from '@/features/posts';
import { safeGoBack } from '@/shared/navigation/safe-navigation';
import { COLORS } from '@/shared/constants';
import { useTranslation } from '@/shared/i18n';

export default function PostDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id?: string }>();

  const postId = Number(params.id);

  const { data: post, isLoading: isPostLoading, isError: isPostError } = usePost(postId);

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = usePostComments(postId);

  if (!Number.isFinite(postId)) {
    return (
      <View className="flex-1 items-center justify-center bg-base-white">
        <Text className="text-error">{t('post.invalidId')}</Text>
      </View>
    );
  }

  if (isPostLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isPostError || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-base-white px-6">
        <Text className="text-error text-center">{t('post.failedToLoad')}</Text>
        <Pressable
          className="mt-4 px-4 py-2 bg-primary rounded-xl"
          onPress={() => safeGoBack(router, '/(tabs)')}
        >
          <Text className="text-base-white">{t('common.back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base-white">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-12 pb-6">
          <Pressable
            onPress={() => safeGoBack(router, '/(tabs)')}
            className="w-10 h-10 items-center justify-center mb-6"
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS['base-black']} />
          </Pressable>

          <Text className="text-2xl font-bold text-base-black">{post.title}</Text>

          <Text className="text-gray-text text-base mt-4">{post.body}</Text>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-gray-text text-sm mb-3">{t('post.comments')}</Text>

          {isCommentsLoading && <ActivityIndicator />}

          {isCommentsError && <Text className="text-error">{t('post.commentsError')}</Text>}

          {comments?.map((comment) => (
            <View key={comment.id} className="bg-gray-light rounded-2xl p-4 mb-3">
              <Text className="text-base-black font-semibold">{comment.name}</Text>
              <Text className="text-gray-text text-sm mt-1">{comment.email}</Text>
              <Text className="text-base-black text-sm mt-2">{comment.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
