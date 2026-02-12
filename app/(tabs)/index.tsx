import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { usePosts, Post } from '@/features/posts';
import { selectUser } from '@/features/auth/store';
import { useTranslation } from '@/shared/i18n';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const { data: posts } = usePosts({ limit: 3 });

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.username ?? '—');

  return (
    <View className="flex-1 bg-base-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-primary rounded-b-3xl px-4 pt-12 pb-8">
          <Text className="text-base-white text-sm opacity-80 text-center">
            {t('home.yourName')}
          </Text>
          <Text className="text-base-white text-2xl font-bold text-center mt-1">{userName}</Text>
        </View>

        <View className="px-4 mt-4">
          <View className="bg-base-white rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base-black font-semibold">{t('home.testTask.title')}</Text>
              <Text className="text-gray-text text-sm mt-1">{t('home.testTask.subtitle')}</Text>
              <Text className="text-success text-sm mt-2">{t('home.testTask.action')}</Text>
            </View>
            <View className="w-16 h-16 bg-success rounded-xl opacity-80" />
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-gray-text text-sm mb-3">{t('home.beforeYouStart.title')}</Text>

          <View className="flex-row space-x-4">
            <View className="flex-1 bg-gray-icon rounded-2xl p-4">
              <Text className="text-base-white font-semibold">
                {t('home.beforeYouStart.bank.title')}
              </Text>
              <Text className="text-base-white text-sm mt-2 opacity-80">
                {t('home.beforeYouStart.bank.steps')}
              </Text>
            </View>

            <View className="flex-1 bg-error rounded-2xl p-4">
              <Text className="text-base-white font-semibold">
                {t('home.beforeYouStart.wallet.title')}
              </Text>
              <Text className="text-base-white text-sm mt-2 opacity-80">
                {t('home.beforeYouStart.wallet.steps')}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-gray-text text-sm mb-3">{t('home.posts')}</Text>

          <View className="space-y-3">
            {posts?.map((post: Post) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/post/${post.id}`)}
                className="bg-gray-light rounded-2xl p-4"
              >
                <Text className="text-base-black font-semibold">{post.title}</Text>
                <Text className="text-gray-text text-sm mt-2" numberOfLines={2}>
                  {post.body}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
