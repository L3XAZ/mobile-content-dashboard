import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { Post, usePosts } from '@/features/posts';
import { COLORS } from '@/shared/constants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useTranslation } from '@/shared/i18n';
import { safeGoBack } from '@/shared/navigation/safe-navigation';
import { BackButton, ContentCard } from '@/shared/ui';

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);
  const { data: posts } = usePosts();

  const filteredPosts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return posts ?? [];
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    return posts?.filter((post) => post.title.toLowerCase().includes(lowerQuery)) ?? [];
  }, [posts, debouncedQuery]);

  return (
    <View className="flex-1 bg-gray-light">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-14 pb-4">
          <View className="flex-row items-center mb-4">
            <BackButton onPress={() => safeGoBack(router, '/(tabs)')} />
            <Text className="text-2xl font-bold text-base-black ms-3">{t('search.title')}</Text>
          </View>

          <View
            className="flex-row items-center rounded-2xl px-4 py-3 border bg-gray-light"
            style={{ borderColor: COLORS['gray-border'] }}
          >
            <MaterialIcons name="search" size={20} color={COLORS['gray-placeholder']} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('search.placeholder')}
              className="ms-3 flex-1 text-base-black"
              placeholderTextColor={COLORS['gray-placeholder']}
            />
          </View>
        </View>

        <View className="px-4 mt-4">
          {filteredPosts.length === 0 && (
            <Text className="text-gray-text text-sm">{t('search.empty')}</Text>
          )}

          <View className="gap-3">
            {filteredPosts.map((post: Post) => (
              <ContentCard
                key={post.id}
                header={t('search.postId', { id: post.id })}
                body={post.title}
                onPress={() => router.push(`/post/${post.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
