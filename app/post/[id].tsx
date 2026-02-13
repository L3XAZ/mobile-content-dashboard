import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { usePost, usePostComments } from '@/features/posts';
import { useTranslation } from '@/shared/i18n';
import { safeGoBack } from '@/shared/navigation/safe-navigation';
import { BackButton, ContentCard } from '@/shared/ui';

const POST_ILLUSTRATION: ImageSourcePropType =
  require('@/assets/images/post-illustration.png') as ImageSourcePropType;

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
          className="mt-4 px-5 py-3 bg-primary rounded-2xl"
          onPress={() => safeGoBack(router, '/(tabs)')}
        >
          <Text className="text-base-white font-semibold text-center">{t('common.back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-light">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="bg-base-white rounded-b-[32px] pt-14 pb-8 px-4">
          <View className="mb-6">
            <BackButton onPress={() => safeGoBack(router, '/(tabs)')} />
          </View>

          <Text className="text-2xl font-bold text-base-black text-center">{post.title}</Text>

          <View className="mt-6 items-center">
            <Image
              source={POST_ILLUSTRATION}
              style={{ width: 260, height: 200 }}
              contentFit="contain"
            />
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-gray-text text-sm mb-3">{t('post.about')}</Text>

          <ContentCard body={post.body} bodyTone="primary" />
        </View>

        <View className="px-4 mt-8">
          <Text className="text-gray-text text-sm mb-3">{t('post.comments')}</Text>

          {isCommentsLoading && <ActivityIndicator />}

          {isCommentsError && <Text className="text-error">{t('post.commentsError')}</Text>}

          <View className="gap-3">
            {comments?.map((comment) => (
              <ContentCard
                key={comment.id}
                header={
                  <View>
                    <Text className="text-base-black font-semibold">{comment.name}</Text>
                    <Text className="text-base-black text-sm">{comment.email}</Text>
                  </View>
                }
                body={comment.body}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
