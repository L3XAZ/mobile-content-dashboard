import { useQuery } from '@tanstack/react-query';

import { getPostComments } from '../api';
import { Comment } from '../types';
import { postsQueryKey } from './use-posts';

export const usePostComments = (postId: number) => {
  return useQuery<Comment[]>({
    queryKey: [...postsQueryKey, postId, 'comments'],
    queryFn: () => getPostComments(postId),
  });
};
