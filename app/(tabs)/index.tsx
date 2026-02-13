import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectUser } from '@/features/auth/store';
import { Post, usePosts } from '@/features/posts';
import { useTranslation } from '@/shared/i18n';
import { ContentCard } from '@/shared/ui/cards/ContentCard';

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
    <View className="flex-1 bg-gray-light">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* header unchanged */}
        <View className="relative overflow-hidden">
          <View className="bg-primary pt-16 pb-14 px-4 rounded-b-[32px]">
            <Text className="text-base-white text-sm opacity-80 text-center">
              {t('home.yourName')}
            </Text>
            <Text className="text-base-white text-3xl font-bold text-center mt-2">{userName}</Text>
          </View>

          <LinearGradient
            colors={['rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            className="absolute inset-x-0 bottom-0 h-16"
          />

          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="absolute inset-x-0 top-0 h-12"
          />
        </View>

        {/* test task unchanged */}
        <View className="px-4 mt-6">
          <View className="bg-base-white rounded-3xl p-6 flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="text-base-black font-semibold">{t('home.testTask.title')}</Text>
              <Text className="text-gray-text text-sm mt-1">{t('home.testTask.subtitle')}</Text>
              <Text className="text-success text-sm font-semibold mt-4">
                {t('home.testTask.action')}
              </Text>
            </View>

            <View className="w-20 h-20 rounded-2xl overflow-hidden">
              <LinearGradient
                colors={['#35B4C6', '#1E8FA0']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.18)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
              />
            </View>
          </View>
        </View>

        {/* BEFORE YOU START — усиленный свет */}
        <View className="mt-8">
          <Text className="px-4 text-gray-text text-sm mb-3">{t('home.beforeYouStart.title')}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            <View className="w-60 rounded-3xl overflow-hidden">
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.32)',
                  'rgba(255,255,255,0.14)',
                  'rgba(255,255,255,0.04)',
                  'transparent',
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                className="absolute inset-0"
              />
              <View className="bg-[#636363] p-5">
                <Text className="text-base-white font-semibold">
                  {t('home.beforeYouStart.bank.title')}
                </Text>
                <Text className="text-base-white text-sm mt-3 opacity-80">
                  {t('home.beforeYouStart.bank.steps')}
                </Text>
              </View>
            </View>

            <View className="w-60 rounded-3xl overflow-hidden">
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.32)',
                  'rgba(255,255,255,0.14)',
                  'rgba(255,255,255,0.04)',
                  'transparent',
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                className="absolute inset-0"
              />
              <View className="bg-[#EE6363] p-5">
                <Text className="text-base-white font-semibold">
                  {t('home.beforeYouStart.wallet.title')}
                </Text>
                <Text className="text-base-white text-sm mt-3 opacity-80">
                  {t('home.beforeYouStart.wallet.steps')}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* posts unchanged */}
        <View className="px-4 mt-8">
          <Text className="text-gray-text text-sm mb-3">{t('home.posts')}</Text>

          <View className="gap-3">
            {posts?.map((post: Post) => (
              <ContentCard
                key={post.id}
                header={post.title}
                body={post.body}
                onPress={() => router.push(`/post/${post.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
