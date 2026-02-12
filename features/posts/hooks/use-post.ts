import { useQuery } from '@tanstack/react-query';

import { getPostById } from '../api';
import { Post } from '../types';
import { postsQueryKey } from './use-posts';

export const usePost = (id: number) => {
  return useQuery<Post>({
    queryKey: [...postsQueryKey, id],
    queryFn: () => getPostById(id),
  });
};
