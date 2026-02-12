import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { usePosts, Post } from '@/features/posts';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useTranslation } from '@/shared/i18n';

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
    <View className="flex-1 bg-base-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-12 pb-4">
          <Text className="text-2xl font-bold text-base-black mb-4">{t('search.title')}</Text>

          <View className="flex-row items-center bg-gray-light rounded-2xl px-4 py-3">
            <MaterialIcons name="search" size={20} color="#AAAAAA" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('search.placeholder')}
              className="ml-3 flex-1 text-base-black"
              placeholderTextColor="#AAAAAA"
            />
          </View>
        </View>

        <View className="px-4 mt-4">
          {filteredPosts.length === 0 && (
            <Text className="text-gray-text text-sm">{t('search.empty')}</Text>
          )}

          <View className="space-y-3">
            {filteredPosts.map((post: Post) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/post/${post.id}`)}
                className="bg-base-white rounded-2xl p-4 border border-gray-light"
              >
                <Text className="text-gray-text text-xs mb-1">
                  {t('search.postId', { id: post.id })}
                </Text>
                <Text className="text-base-black font-semibold">
                  {t('search.postName', { title: post.title })}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
