import { useQuery } from '@tanstack/react-query';

import { getPosts } from '../api';
import { Post } from '../types';

type UsePostsOptions = {
  limit?: number;
};

export const postsQueryKey = ['posts'];

export const usePosts = (options?: UsePostsOptions) => {
  const { limit } = options || {};

  return useQuery<Post[]>({
    queryKey: postsQueryKey,
    queryFn: getPosts,
    select: (posts) => {
      if (limit) {
        return posts.slice(0, limit);
      }
      return posts;
    },
  });
};
